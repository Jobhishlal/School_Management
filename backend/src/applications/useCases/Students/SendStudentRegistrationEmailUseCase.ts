import { SendEMail } from "../../../infrastructure/providers/EmailService";
import { EmailMessages } from "../../../shared/constants/utils/messages";
import { IEmailServiceShare } from "../../../domain/UseCaseInterface/StudentCreate/IEmailSendUsecase";

export class SendEMailServiceStudent implements IEmailServiceShare{
    async execute(parentName: string, parentEmail: string, studentName: string, studentId: string, tempPassword: string): Promise<void> {
        const emailmessage = EmailMessages.STUDENT_REGISTRATION(
            parentName??"Parent",
            studentName??"studentName",
            studentId??"StudentId"
            ,tempPassword??"temppassword")
            console.log("email message read",emailmessage)
        await SendEMail(parentEmail,"Student Registerd Successfully",emailmessage)
    }
}