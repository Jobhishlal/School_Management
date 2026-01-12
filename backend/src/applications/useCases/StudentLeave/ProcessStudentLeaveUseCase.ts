import { IProcessStudentLeaveUseCase } from "../../../domain/UseCaseInterface/StudentLeave/IProcessStudentLeaveUseCase";
import { IStudentLeaveRepository } from "../../../domain/repositories/StudentLeave/IStudentLeaveRepository";
import { StudentLeaveEntity } from "../../../domain/entities/StudentLeave/StudentLeaveEntity";
import { IParentRepositorySign } from "../../../domain/repositories/Auth/IParentRepository";
import { SendEMail } from "../../../infrastructure/providers/EmailService";
import { studentLeaveStatusTemplate } from "../../../shared/constants/utils/Email/studentLeaveStatus.template";

export class ProcessStudentLeaveUseCase implements IProcessStudentLeaveUseCase {
    constructor(
        private readonly studentLeaveRepo: IStudentLeaveRepository,
        private readonly parentRepo: IParentRepositorySign
    ) { }

    async execute(leaveId: string, status: "APPROVED" | "REJECTED", actionBy: string, message?: string): Promise<StudentLeaveEntity | null> {
            
    const updatedLeave =
      await this.studentLeaveRepo.updateLeaveStatus(
        leaveId,
        status,
        actionBy,
        message
      );

    if (!updatedLeave) return null;

    try {
      const parent =
        await this.parentRepo.findById(updatedLeave.parentId);

      if (parent?.email) {

        const studentName =
          (updatedLeave.studentId as any)?.fullName || "Student";

        const { subject, html } = studentLeaveStatusTemplate({
          studentName,
          status,
          leaveType: updatedLeave.leaveType,
          startDate: updatedLeave.startDate,
          endDate: updatedLeave.endDate,
          reason: updatedLeave.reason,
          message
        });

        await SendEMail(
          parent.email,
          subject,
          "Leave update notification",
          html
        );
      }

    } catch (error) {
      console.error("Email sending failed:", error);
    }

    return updatedLeave;
  }
    }
