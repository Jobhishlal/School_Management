import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server;


import { ChatRepositoryMongo } from '../repositories/Chat/ChatRepositoryMongo';

const chatRepo = new ChatRepositoryMongo();
const meetingParticipants = new Map<string, Map<string, any>>();

const socketMeetingMap = new Map<string, string>();
const waitingRoom = new Map<string, Map<string, any>>();

const onlineUsers = new Map<string, Set<string>>();
const chatSocketMap = new Map<string, string>();

export const initSocket = (httpServer: HttpServer) => {
  const allowedOrigins = [
    'https://brainnots.ddns.net',
    'http://brainnots.ddns.net',
    'https://13.54.178.155',
    'http://13.54.178.155',
    'http://localhost:5173',
    'https://localhost:5173',
    process.env.CLIENT_URL,
    process.env.SERVER_URL
  ].filter((origin): origin is string => typeof origin === 'string');

  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("join", ({ classId, division }) => {
      console.log(`User socket ${socket.id} joining rooms: class-${classId}, division-${division}`);
      if (classId) socket.join(`class-${classId}`);
      if (division) socket.join(`division-${division}`);
    });

    // --- Chat Logic ---
    socket.on('join_chat', (userId: string) => {
      socket.join(userId);
      console.log(`User ${userId} joined their personal chat room`);


      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
        io.emit('user_online', userId);
      }
      onlineUsers.get(userId)!.add(socket.id);
      chatSocketMap.set(socket.id, userId);


      socket.emit('online_users', Array.from(onlineUsers.keys()));
    });

    socket.on('send_private_message', async (data: { senderId: string, receiverId: string, content: string, senderModel?: string, receiverModel?: string, type?: 'text' | 'image' | 'file' }) => {
      console.log(`[SOCKET] send_private_message received:`, data);
      const { senderId, receiverId, content, senderModel = 'Students', receiverModel = 'Teacher', type = 'text' } = data;

      if (!receiverId || !senderId) {
        console.error(`[SOCKET ERROR] Missing senderId or receiverId in send_private_message.`, data);
        // Optionally emit error back to client?
        return;
      }

      try {
        // 1. Save message
        const savedMessage = await chatRepo.saveMessage({
          senderId: senderId as any,
          senderModel: senderModel as any,
          receiverId: receiverId as any,
          receiverModel: receiverModel as any,
          content,
          read: false,
          type: type
        });

        // 2. Update conversation
        if (receiverModel === 'Conversation') {
          await chatRepo.updateConversationLastMessage(receiverId, savedMessage.id as string);
        } else {
          await chatRepo.createOrUpdateConversation(senderId, senderModel, receiverId, receiverModel, savedMessage.id as string);
        }

        // 3. Emit to receiver(s)
        if (receiverModel === 'Conversation') {
          // If group, fetch participants and emit to each
          const conversation = await chatRepo.findConversationById(receiverId);
          if (conversation && conversation.participants) {
            conversation.participants.forEach(participant => {
              const participantId = participant.participantId; // Entity guarantees string

              io.to(participantId).emit('receive_private_message', savedMessage);
              io.to(participantId).emit('receive_message', savedMessage);
            });
          }
        } else {
          // Single user message
          io.to(receiverId).emit('receive_private_message', savedMessage);
          io.to(receiverId).emit('receive_message', savedMessage);
        }

        // 4. Emit to sender confirmation (for multi-device sync)
        io.to(senderId).emit('message_sent_confirmation', savedMessage);

      } catch (error) {
        console.error("Error handling private message:", error);
      }
    });

    socket.on('typing_start', (data: { to: string }) => {
      const senderId = chatSocketMap.get(socket.id);
      if (senderId) {
        io.to(data.to).emit('typing_started', { from: senderId });
      }
    });

    socket.on('typing_stop', (data: { to: string }) => {
      const senderId = chatSocketMap.get(socket.id);
      if (senderId) {
        io.to(data.to).emit('typing_stopped', { from: senderId });
      }
    });
    // --- End Chat Logic ---




    socket.on("join-meeting", async ({ meetingId, userId, role, userData, meetingCreatorId }) => {
      console.log('\n🔵 === JOIN-MEETING EVENT RECEIVED ===');
      console.log(`Meeting ID: ${meetingId}`);
      console.log(`User ID: ${userId}`);
      console.log(`Role: ${role}`);
      console.log(`Creator ID: ${meetingCreatorId}`);
      console.log(`Socket ID: ${socket.id}`);

      const isCreator = String(userId).trim() === String(meetingCreatorId).trim();
      const normalizedRole = role ? String(role).toLowerCase() : '';
      console.log(`[Host Check] Normalized Role: '${normalizedRole}', Original Role: '${role}'`);

      const isAdmin = normalizedRole === 'admin' || normalizedRole === 'super_admin' || normalizedRole === 'sub_admin';
      const isHost = isCreator || isAdmin;

      console.log(`[Host Check] Meeting: ${meetingId}`);
      console.log(`[Host Check] UserID: '${userId}' vs CreatorID: '${meetingCreatorId}'`);
      console.log(`[Host Check] Role: '${role}'`);
      console.log(`[Host Check] Is Creator: ${isCreator}, Is Admin: ${isAdmin} -> FINAL: ${isHost ? 'IS HOST' : 'IS PARTICIPANT'}`);

      if (!isHost) {

        const participants = meetingParticipants.get(meetingId);
        let hostSocketId = null;
        if (participants) {
          for (const [sId, p] of participants) {
            if (p.isHost) {
              hostSocketId = sId;
              break;
            }
          }
        }


        if (!waitingRoom.has(meetingId)) {
          waitingRoom.set(meetingId, new Map());
        }
        const roomWaiters = waitingRoom.get(meetingId);
        if (roomWaiters) {
          for (const [sId, waiter] of roomWaiters.entries()) {
            if (String(waiter.userId) === String(userId)) {
              roomWaiters.delete(sId);
            }
          }
        }

        waitingRoom.get(meetingId)?.set(socket.id, { userId, role, userData, socketId: socket.id });
        socket.join(`waiting-${meetingId}`); // Special room for waiters

        console.log(`\n❌ PARTICIPANT ROUTE - Adding to waiting room`);
        console.log(`User ${userId} added to WAITING ROOM for ${meetingId}`);
        console.log(`Current waiting room size: ${waitingRoom.get(meetingId)?.size}`);
        console.log(`Host socket exists: ${!!hostSocketId}`);

        socket.emit(hostSocketId ? "waiting-for-approval" : "waiting-for-host");

        // Notify ALL participants in the meeting room about the new waiter
        console.log(`📢 EMITTING user-joined-waiting to room: ${meetingId}`);
        console.log(`Broadcasting to all sockets in room ${meetingId}`);
        const roomSockets = await io.in(meetingId).fetchSockets();
        console.log(`Room ${meetingId} has ${roomSockets.length} sockets`);
        roomSockets.forEach(s => console.log(`  - Socket: ${s.id}`));

        io.to(meetingId).emit("user-joined-waiting", { userId, role, userData, socketId: socket.id });
        console.log(`✅ Emitted user-joined-waiting event`);
        return;
      }


      socket.join(meetingId);


      if (!meetingParticipants.has(meetingId)) {
        meetingParticipants.set(meetingId, new Map());
      }
      const participants = meetingParticipants.get(meetingId);


      participants?.set(socket.id, { userId, role, userData, isHost });
      socketMeetingMap.set(socket.id, meetingId);


      const uniqueUsers = new Set(Array.from(participants?.values() || []).map(p => p.userId)).size;
      const activeConnections = participants?.size || 0;

      console.log(`\n✅ HOST ROUTE - Adding to meeting room`);
      console.log(`HOST ${userId} joined meeting ${meetingId}. Active Connections: ${activeConnections}`);
      console.log(`Socket ${socket.id} joined room: ${meetingId}`);
      console.log(`=== END JOIN-MEETING ===\n`);

      const waiters = waitingRoom.has(meetingId)
        ? Array.from(waitingRoom.get(meetingId)?.values() || [])
        : [];
      socket.emit("waiting-list-update", waiters);


      socket.to(meetingId).emit("user-connected", { userId, socketId: socket.id, role, userData });

      io.to(`waiting-${meetingId}`).emit("waiting-for-approval");
    });

    socket.on("admit-user", ({ meetingId, socketId }) => {
      console.log(`[ADMIT-USER] Request for Socket: ${socketId} in Meeting: ${meetingId}`);


      const waiters = waitingRoom.get(meetingId);
      console.log(`[ADMIT-USER] Waiters found for meeting:`, waiters ? Array.from(waiters.keys()) : 'None');

      if (waiters && waiters.has(socketId)) {
        const userData = waiters.get(socketId);
        waiters.delete(socketId);

        const participants = meetingParticipants.get(meetingId);
        if (!participants) {
          meetingParticipants.set(meetingId, new Map());
        }
        meetingParticipants.get(meetingId)?.set(userData.socketId, { ...userData, isHost: false });
        socketMeetingMap.set(userData.socketId, meetingId);

        io.to(socketId).emit("admission-granted");


        const admittedSocket = io.sockets.sockets.get(socketId);
        console.log(`[ADMIT-USER] Socket Object retrieved? ${!!admittedSocket}`);

        if (admittedSocket) {
          admittedSocket.leave(`waiting-${meetingId}`);
          admittedSocket.join(meetingId);

          // Broadcast to room
          admittedSocket.to(meetingId).emit("user-connected", {
            userId: userData.userId,
            socketId: userData.socketId,
            role: userData.role,
            userData: userData.userData
          });
        }

        console.log(`Admitted user ${userData.userId} to meeting ${meetingId}`);

        // Notify all meeting participants of updated waiting list
        const updatedWaiters = Array.from(waiters.values());
        io.to(meetingId).emit("waiting-list-update", updatedWaiters);
      }
    });

    socket.on("reject-user", ({ meetingId, socketId }) => {
      const waiters = waitingRoom.get(meetingId);
      if (waiters && waiters.has(socketId)) {
        waiters.delete(socketId);
        io.to(socketId).emit("admission-rejected");
        // Disconnect them?
        const rejectedSocket = io.sockets.sockets.get(socketId);
        if (rejectedSocket) rejectedSocket.disconnect();

        // Notify all meeting participants of updated waiting list
        const updatedWaiters = Array.from(waiters.values());
        io.to(meetingId).emit("waiting-list-update", updatedWaiters);
      }
    });

    // Generic signaling (offer, answer, ice-candidate)
    socket.on("signal", (data) => {

      io.to(data.to).emit("signal", {
        signal: data.signal,
        from: socket.id,
        userPayload: data.userPayload // Forward metadata
      });
    });

    socket.on("chat-message", (data) => {
      // data: { meetingId, message, senderId, senderName, timestamp }
      io.to(data.meetingId).emit("chat-message", data);
    });

    socket.on("send-reaction", (data) => {
      // data: { meetingId, userId, emoji }
      io.to(data.meetingId).emit("reaction-received", data);
    });

    socket.on("end-meeting", ({ meetingId }) => {
      io.to(meetingId).emit("meeting-ended");

      io.in(meetingId).socketsLeave(meetingId);


      if (meetingParticipants.has(meetingId)) {
        const participants = meetingParticipants.get(meetingId);
        participants?.forEach((_, socketId) => socketMeetingMap.delete(socketId));
        meetingParticipants.delete(meetingId);
      }
    });

    socket.on("disconnect", () => {
      // Chat Cleanup
      const chatUserId = chatSocketMap.get(socket.id);
      if (chatUserId) {
        chatSocketMap.delete(socket.id);
        const userSockets = onlineUsers.get(chatUserId);
        if (userSockets) {
          userSockets.delete(socket.id);
          if (userSockets.size === 0) {
            onlineUsers.delete(chatUserId);
            io.emit('user_offline', chatUserId);
          }
        }
      }

      const meetingId = socketMeetingMap.get(socket.id);

      if (meetingId && meetingParticipants.has(meetingId)) {
        const participants = meetingParticipants.get(meetingId);
        const participantData = participants?.get(socket.id);
        const userId = participantData?.userId;

        participants?.delete(socket.id);
        socketMeetingMap.delete(socket.id);


        const uniqueUsers = new Set(Array.from(participants?.values() || []).map(p => p.userId)).size;
        const activeConnections = participants?.size || 0;

        console.log(`❌ User disconnected: ${socket.id} (User: ${userId}) from meeting ${meetingId}. Unique Users: ${uniqueUsers}, Connections: ${activeConnections}`);


        if (participantData?.isHost) {
          console.log(`🚨 HOST disconnected: ${socket.id} (User: ${userId}). Ending meeting ${meetingId} for everyone.`);


          io.to(meetingId).emit("meeting-ended");


          io.in(meetingId).socketsLeave(meetingId);


          if (meetingParticipants.has(meetingId)) {
            const parts = meetingParticipants.get(meetingId);
            parts?.forEach((_, sId) => socketMeetingMap.delete(sId));
            meetingParticipants.delete(meetingId);
          }
          return;
        }

        // Notify other users to remove the video
        socket.to(meetingId).emit("user-disconnected", socket.id);

        if (activeConnections === 0) {
          meetingParticipants.delete(meetingId);
          console.log(`Meeting ${meetingId} is now empty.`);
        }
      } else {
        let foundInWaiting = false;
        waitingRoom.forEach((waiters, mId) => {
          if (waiters.has(socket.id)) {
            waiters.delete(socket.id);
            foundInWaiting = true;
            console.log(`❌ Waiting User disconnected: ${socket.id} from meeting ${mId}`);


            const updatedWaiters = Array.from(waiters.values());
            io.to(mId).emit("waiting-list-update", updatedWaiters);
          }
        });

        if (!foundInWaiting) {
          console.log(`❌ User disconnected: ${socket.id} (Not in a meeting)`);
        }
      }
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
