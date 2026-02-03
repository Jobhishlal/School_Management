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
                io.to(`class-${cls}`).emit(eventName, data);
            });
        }
        if (data.scope === "DIVISION") {
            io.to(`division-${data.division}`)
                .emit(eventName, data);
        }

    }
}