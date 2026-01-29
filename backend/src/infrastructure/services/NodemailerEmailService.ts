
import { IEmailService } from "../../applications/interfaces/IEmailService";
import { SendEMail } from "../providers/EmailService";

export class NodemailerEmailService implements IEmailService {
    async send(to: string, subject: string, body: string): Promise<void> {
        await SendEMail(to, subject, body);
    }
}
