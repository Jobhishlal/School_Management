import { InterfaceLeaveManagement } from "../../../domain/repositories/ILeaveManagement/ILeaveManagement";
import { ITeacherCreate } from "../../../domain/repositories/TeacherCreate";
import { LeaveManagementEntity } from "../../../domain/entities/LeaveManagement/LeaveManagementEntity";
import { IInstituterepo } from "../../../domain/repositories/SchoolProfile.ts/IInstituteRepo";
import { SendEMail } from "../../../infrastructure/providers/EmailService";
import { EmailTemplates } from "../../../shared/constants/utils/Email/emailTemplates";

export class UpdateLeaveStatusUseCase {
    constructor(
        private leaveRepo: InterfaceLeaveManagement,
        private teacherRepo: ITeacherCreate,
        private instituteRepo: IInstituterepo
    ) { }

    async execute(
        leaveId: string,
        status: string,
        actionBy: string,
        adminRemark?: string
    ): Promise<LeaveManagementEntity | null> {

        const existingLeave = await this.leaveRepo.findById(leaveId);
        if (!existingLeave) {
            return null;
        }


        if (status === "APPROVED" && (existingLeave.leaveType === "SICK" || existingLeave.leaveType === "CASUAL")) {
            const teacher = await this.teacherRepo.findById(existingLeave.teacherId);
            if (teacher && teacher.leaveBalance) {
                const currentBalance = existingLeave.leaveType === "SICK"
                    ? teacher.leaveBalance.sickLeave
                    : teacher.leaveBalance.casualLeave;


                if (currentBalance < existingLeave.totalDays) {
                    throw new Error(`Cannot approve. Insufficient ${existingLeave.leaveType} leave balance. Available: ${currentBalance}, Required: ${existingLeave.totalDays}`);
                }
            }
        }
        const updatedLeave = await this.leaveRepo.updateStatus(
            leaveId,
            status,
            actionBy,
            adminRemark
        );

        if (updatedLeave) {
            const teacher = await this.teacherRepo.findById(updatedLeave.teacherId);

            if (teacher) {
                if (status === "APPROVED" && teacher.leaveBalance) {
                    if (updatedLeave.leaveType === "SICK") {
                        teacher.leaveBalance.sickLeave -= updatedLeave.totalDays;
                    } else if (updatedLeave.leaveType === "CASUAL") {
                        teacher.leaveBalance.casualLeave -= updatedLeave.totalDays;
                    }

                    await this.teacherRepo.update(teacher.id, {
                        leaveBalance: teacher.leaveBalance,
                    });
                }


                try {
                    if (teacher.email) {
                        const institutes = await this.instituteRepo.getAll();
                        const institute = institutes.length > 0 ? institutes[0] : null;
                        const instituteName = institute?.instituteName || "School Administration";
                        const instituteLogo = institute?.logo && institute.logo.length > 0 ? institute.logo[0].url : undefined;

                        const emailHtml = EmailTemplates.leaveStatusUpdate({
                            teacherName: teacher.name,
                            status: status as "APPROVED" | "REJECTED" | "CANCELLED",
                            leaveType: updatedLeave.leaveType,
                            startDate: new Date(updatedLeave.startDate).toLocaleDateString(),
                            endDate: new Date(updatedLeave.endDate).toLocaleDateString(),
                            totalDays: updatedLeave.totalDays,
                            adminRemark: adminRemark,
                            instituteName: instituteName,
                            instituteLogo: instituteLogo
                        });

                        await SendEMail(
                            teacher.email,
                            `Leave Request ${status} - ${instituteName}`,
                            `Your leave request has been ${status.toLowerCase()}.`,
                            emailHtml
                        );
                    }
                } catch (emailError) {
                    console.error("Failed to send leave status email:", emailError);
                    // Do not throw error, as the main operation succeeded
                }
            }
        }

        return updatedLeave;
    }
}
