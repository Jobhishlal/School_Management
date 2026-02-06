import { NotificationDTO } from "../../applications/dto/AnnouncementNotificationDTO";
import { NotificationPort } from "../../applications/ports/NotificationPort";
import { getIO } from "./socket";

export class SocketNotification implements NotificationPort {

    async send(data: NotificationDTO): Promise<void> {
        const io = getIO()
        console.log("Socket Notification Sending:", data);

        const eventName = "notification:new";

        if (data.scope === "GLOBAL") {
            io.emit(eventName, data)
        }
        if (data.scope === "CLASS") {
            data.classes.forEach(cls => {
                const room = `class-${cls}`;
                console.log(`Emitting CLASS notification to room: ${room}`);
                io.to(room).emit(eventName, data);
            });
        }
        if (data.scope === "DIVISION") {
            const room = `division-${data.division}`;
            console.log(`Emitting DIVISION notification to room: ${room}`);
            io.to(room).emit(eventName, data);
        }
        if (data.scope === "USER" && data.recipientId) {
            console.log(`Emitting USER notification to room: ${data.recipientId}`);
            io.to(data.recipientId).emit(eventName, data);
        }

    }
}