import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server;


const meetingParticipants = new Map<string, Map<string, any>>();
// Track which meeting a socket is in: socketId -> meetingId
const socketMeetingMap = new Map<string, string>();
const waitingRoom = new Map<string, Map<string, any>>(); // meetingId -> Map<socketId, userData>

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    // Existing logic
    socket.on("join", ({ classId, division }) => {
      if (classId) socket.join(`class-${classId}`);
      if (division) socket.join(`division-${division}`);
    });



 
    socket.on("join-meeting", ({ meetingId, userId, role, userData, meetingCreatorId }) => {
     
      const isCreator = String(userId).trim() === String(meetingCreatorId).trim();
      const normalizedRole = role ? String(role).toLowerCase() : '';
      
      const isAdmin = normalizedRole === 'admin' || normalizedRole === 'super_admin';
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

    
        socket.emit(hostSocketId ? "waiting-for-approval" : "waiting-for-host");
        console.log(`User ${userId} added to WAITING ROOM for ${meetingId}`);

        if (hostSocketId) {
          io.to(hostSocketId).emit("user-joined-waiting", { userId, role, userData, socketId: socket.id });
        }
        return;
      }

      // --- HOST LOGIC BELOW ---
      socket.join(meetingId);

      
      if (!meetingParticipants.has(meetingId)) {
        meetingParticipants.set(meetingId, new Map());
      }
      const participants = meetingParticipants.get(meetingId);

      
      participants?.set(socket.id, { userId, role, userData, isHost });
      socketMeetingMap.set(socket.id, meetingId);

 
      const uniqueUsers = new Set(Array.from(participants?.values() || []).map(p => p.userId)).size;
      const activeConnections = participants?.size || 0;

      console.log(`HOST ${userId} joined meeting ${meetingId}. Active Connections: ${activeConnections}`);

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

        // Move user to real meeting
        const participants = meetingParticipants.get(meetingId);
        if (!participants) {
          meetingParticipants.set(meetingId, new Map());
        }
        meetingParticipants.get(meetingId)?.set(userData.socketId, { ...userData, isHost: false });
        socketMeetingMap.set(userData.socketId, meetingId);

        // Notify User
        io.to(socketId).emit("admission-granted");

        // Make user join the socket room now
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
