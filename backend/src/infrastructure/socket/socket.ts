import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server;

// Track participants in each meeting: meetingId -> Map<socketId, userId>
// We use a Map<socketId, userId> to easily get the userId for a socket, 
// and to count unique values in the map for "Unique Users".
// Track participants in each meeting: meetingId -> Map<socketId, { userId: string, role: string, userData: any }>
const meetingParticipants = new Map<string, Map<string, any>>();
// Track which meeting a socket is in: socketId -> meetingId
const socketMeetingMap = new Map<string, string>();

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

    // WebRTC Signaling
    socket.on("join-meeting", ({ meetingId, userId, role, userData }) => {
      socket.join(meetingId);

      // Track participant
      if (!meetingParticipants.has(meetingId)) {
        meetingParticipants.set(meetingId, new Map());
      }

      // Map socket to user data
      meetingParticipants.get(meetingId)?.set(socket.id, { userId, role, userData });
      socketMeetingMap.set(socket.id, meetingId);

      // Calculate counts
      const participants = meetingParticipants.get(meetingId);
      const uniqueUsers = new Set(Array.from(participants?.values() || []).map(p => p.userId)).size;
      const activeConnections = participants?.size || 0;

      console.log(`User ${userId} (${role}) joined meeting ${meetingId}. Name: ${userData?.name}. Unique Users: ${uniqueUsers}, Active Connections: ${activeConnections}`);

      // Notify others in the room that a user connected
      socket.to(meetingId).emit("user-connected", { userId, socketId: socket.id, role, userData });
    });

    // Generic signaling (offer, answer, ice-candidate)
    socket.on("signal", (data) => {
      // data: { to: socketId, signal: any, from: socketId, userPayload: { userId, role } }
      io.to(data.to).emit("signal", {
        signal: data.signal,
        from: socket.id,
        userPayload: data.userPayload // Forward metadata
      });
    });

    socket.on("end-meeting", ({ meetingId }) => {
      io.to(meetingId).emit("meeting-ended");
      // Optionally make everyone leave
      io.in(meetingId).socketsLeave(meetingId);

      // Clear tracking for this meeting
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

        // Recalculate
        const uniqueUsers = new Set(Array.from(participants?.values() || []).map(p => p.userId)).size;
        const activeConnections = participants?.size || 0;

        console.log(`❌ User disconnected: ${socket.id} (User: ${userId}) from meeting ${meetingId}. Unique Users: ${uniqueUsers}, Connections: ${activeConnections}`);

        // Notify other users to remove the video
        socket.to(meetingId).emit("user-disconnected", socket.id);

        if (activeConnections === 0) {
          meetingParticipants.delete(meetingId);
          console.log(`Meeting ${meetingId} is now empty.`);
        }
      } else {
        console.log(`❌ User disconnected: ${socket.id} (Not in a meeting)`);
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
