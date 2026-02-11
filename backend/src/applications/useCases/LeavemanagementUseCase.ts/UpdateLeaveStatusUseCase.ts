import { InterfaceLeaveManagement } from "../../interface/RepositoryInterface/ILeaveManagement/ILeaveManagement";
import { ITeacherCreate } from "../../interface/RepositoryInterface/TeacherCreate";
import { LeaveManagementEntity } from "../../../domain/entities/LeaveManagement/LeaveManagementEntity";
import { IInstituterepo } from "../../interface/RepositoryInterface/SchoolProfile.ts/IInstituteRepo";
import { SendEMail } from "../../../infrastructure/providers/EmailService";
import { EmailTemplates } from "../../../shared/constants/utils/Email/emailTemplates";
import { IUpdateLeaveStatusUseCase } from "../../interface/UseCaseInterface/LeaveManagement/IUpdateLeaveStatusUseCase";
import { SubAdminRepository } from "../../interface/RepositoryInterface/SubAdminCreate";

export class UpdateLeaveStatusUseCase implements IUpdateLeaveStatusUseCase {
    constructor(
        private leaveRepo: InterfaceLeaveManagement,
        private teacherRepo: ITeacherCreate,
        private instituteRepo: IInstituterepo,
        private subAdminRepo: SubAdminRepository
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
            if (existingLeave.teacherId) {
                const teacher = await this.teacherRepo.findById(existingLeave.teacherId);
                if (teacher && teacher.leaveBalance) {
                    const currentBalance = existingLeave.leaveType === "SICK"
                        ? teacher.leaveBalance.sickLeave
                        : teacher.leaveBalance.casualLeave;

                    if (currentBalance < existingLeave.totalDays) {
                        throw new Error(`Cannot approve. Insufficient ${existingLeave.leaveType} leave balance. Available: ${currentBalance}, Required: ${existingLeave.totalDays}`);
                    }
                }
            } else if (existingLeave.subAdminId) {
                const subAdmin = await this.subAdminRepo.findById(existingLeave.subAdminId);
                if (subAdmin) {
                  
                    const sickBalance = subAdmin.leaveBalance?.sickLeave ?? 5;
                    const casualBalance = subAdmin.leaveBalance?.casualLeave ?? 5;

                    const currentBalance = existingLeave.leaveType === "SICK"
                        ? sickBalance
                        : casualBalance;

                    if (currentBalance < existingLeave.totalDays) {
                        throw new Error(`Cannot approve. Insufficient ${existingLeave.leaveType} leave balance. Available: ${currentBalance}, Required: ${existingLeave.totalDays}`);
                    }
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
            const institutes = await this.instituteRepo.getAll();
            const institute = institutes.length > 0 ? institutes[0] : null;
            const instituteName = institute?.instituteName || "School Administration";
            const instituteLogo = institute?.logo && institute.logo.length > 0 ? institute.logo[0].url : undefined;

            if (updatedLeave.teacherId) {
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
                    if (teacher.email) {
                        this.sendEmail(teacher.email, teacher.name, updatedLeave, status, adminRemark, instituteName, instituteLogo);
                    }
                }
            } else if (updatedLeave.subAdminId) {
                console.log("Updating leave for SubAdmin:", updatedLeave.subAdminId);
                const subAdmin = await this.subAdminRepo.findById(updatedLeave.subAdminId);
                console.log("SubAdmin found:", subAdmin ? "yes" : "no", subAdmin?.leaveBalance);

                if (subAdmin) {
                    
                    if (!subAdmin.leaveBalance) {
                        console.log("Initializing missing leaveBalance for SubAdmin");
                        subAdmin.leaveBalance = {
                            sickLeave: 5,
                            casualLeave: 5 
                        };
                    }

                    if (status === "APPROVED") {
                        console.log("Current Balance:", subAdmin.leaveBalance);
                        console.log("Leave Type:", updatedLeave.leaveType);
                        console.log("Total Days:", updatedLeave.totalDays);

                        if (updatedLeave.leaveType === "SICK") {
                            subAdmin.leaveBalance.sickLeave -= updatedLeave.totalDays;
                        } else if (updatedLeave.leaveType === "CASUAL") {
                            subAdmin.leaveBalance.casualLeave -= updatedLeave.totalDays;
                        }

                        console.log("New Balance:", subAdmin.leaveBalance);

                     

                        const updateResult = await this.subAdminRepo.update(subAdmin._id, {
                            leaveBalance: subAdmin.leaveBalance
                        });
                        console.log("Update Result:", updateResult?.leaveBalance);
                    }
                    if (subAdmin.email) {
                        this.sendEmail(subAdmin.email, subAdmin.name, updatedLeave, status, adminRemark, instituteName, instituteLogo);
                    }
                }
            }
        }

        return updatedLeave;
    }

    private async sendEmail(email: string, name: string, leave: LeaveManagementEntity, status: string, adminRemark: string | undefined, instituteName: string, instituteLogo: string | undefined) {
        try {
            const emailHtml = EmailTemplates.leaveStatusUpdate({
                teacherName: name,
                status: status as "APPROVED" | "REJECTED" | "CANCELLED",
                leaveType: leave.leaveType,
                startDate: new Date(leave.startDate).toLocaleDateString(),
                endDate: new Date(leave.endDate).toLocaleDateString(),
                totalDays: leave.totalDays,
                adminRemark: adminRemark,
                instituteName: instituteName,
                instituteLogo: instituteLogo
            });

            await SendEMail(
                email,
                `Leave Request ${status} - ${instituteName}`,
                `Your leave request has been ${status.toLowerCase()}.`,
                emailHtml
            );
        } catch (emailError) {
            console.error("Failed to send leave status email:", emailError);
        }
    }
}
