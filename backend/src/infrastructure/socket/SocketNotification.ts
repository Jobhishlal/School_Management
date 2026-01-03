import { AnnouncementNotificationDTO } from "../../applications/dto/AnnouncementNotificationDTO";
import { NotificationPort } from "../../applications/ports/NotificationPort";
import { Announcement } from "../../domain/entities/Announcement/Announcement";
import { getIO } from "./socket";

export class SocketNotification implements NotificationPort{
    
    async send(data: AnnouncementNotificationDTO): Promise<void> {
        const io = getIO()
        if(data.scope==="GLOBAL"){
            console.log("socket working",data)
            io.emit("announcement",data)
        }
        if(data.scope==="CLASS"){
            data.classes.forEach(cls => {
                console.log("socket working",data)
            io.to(`class-${cls}`).emit("announcement:new", data);
         });
        }
        if (data.scope === "DIVISION") {
      io.to(`division-${data.division}`)
        .emit("announcement:new", data);
    }

    }
}