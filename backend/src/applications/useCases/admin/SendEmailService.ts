import { SendEMail } from "../../../infrastructure/providers/EmailService";
import { ISendEmailService } from "../../../domain/UseCaseInterface/SubAdmin/ISendEmailService";

export class EmailServiceSubAdmin implements ISendEmailService{
   async execute(to: string, subject: string, message: string): Promise<void> {
       await SendEMail(to,subject,message)
   }
}