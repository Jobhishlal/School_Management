import { StudentDetails } from "../../../domain/repositories/Admin/IStudnetRepository";
import { ITeacherCreate } from "../../../domain/repositories/TeacherCreate";
import { ISubadminLogin } from "../../../domain/repositories/IAdminRepoLogin";
import { IClassRepository } from "../../../domain/repositories/Classrepo/IClassRepository";
import { IAnnouncementRepository } from "../../../domain/repositories/Announcement/IAnnouncement";
import { IFeeStructureRepository } from "../../../domain/repositories/FeeDetails/IFeeStructureRepository";
import { IPaymentTransactionRepository } from "../../../domain/repositories/FeeDetails/IPaymentTransactionRepository";
import { IExpenseRepository } from "../../../domain/repositories/FeeDetails/IExpesnseRepositoy";
import { IAttandanceRepository } from "../../../domain/repositories/Attandance/IAttendanceRepository";
import { InterfaceLeaveManagement } from "../../../domain/repositories/ILeaveManagement/ILeaveManagement";
import { AdminDashboardDTO } from "../../dto/AdminDashboardDTO";

import { IGetAdminDashboardUseCase } from "../../../domain/UseCaseInterface/IGetAdminDashboardUseCase";

export class GetAdminDashboardUseCase implements IGetAdminDashboardUseCase {
    constructor(
        private studentRepo: StudentDetails,
        private teacherRepo: ITeacherCreate,
        private adminRepo: ISubadminLogin,
        private classRepo: IClassRepository,
        private announcementRepo: IAnnouncementRepository,
        private feeRepo: IFeeStructureRepository,
        private paymentRepo: IPaymentTransactionRepository,
        private expenseRepo: IExpenseRepository,
        private attendanceRepo: IAttandanceRepository,
        private leaveRepo: InterfaceLeaveManagement
    ) { }

    async execute(): Promise<AdminDashboardDTO> {
        const [
            totalStudents,
            totalTeachers,
            totalAdmins,
            totalClasses,
            latestAnnouncements,
            totalExpectedFees,
            totalCollectedFees,
            totalExpenses,
            studentAttendance,
            staffAttendance,
            pendingComplaints, // Placeholder if no repo for complaints yet
            pendingLeaves,
            blockedUsers // Placeholder aggregation
        ] = await Promise.all([
            this.studentRepo.countAll(),
            this.teacherRepo.countAll(),
            this.adminRepo.countAll(),
            this.classRepo.countAll(),
            this.announcementRepo.findLatest(5),
            this.feeRepo.getTotalExpectedFees(),
            this.paymentRepo.getTotalCollectedAmount(),
            this.expenseRepo.getTotalApprovedAmount(),
            this.attendanceRepo.getStudentAttendancePercentage(new Date()),
            this.attendanceRepo.getStaffAttendancePercentage(new Date()),
            Promise.resolve(0), // Placeholder for complaints
            this.leaveRepo.countPendingRequests(),
            Promise.resolve(0) // Placeholder
        ]);

        const blockedStudents = await this.studentRepo.countBlocked();
        const blockedTeachers = await this.teacherRepo.countBlocked();
        // const blockedAdmins = await this.adminRepo.countBlocked(); // If needed/available

        // Calculate pending fees
        const pendingFees = totalExpectedFees - totalCollectedFees;

        return {
            counts: {
                students: totalStudents,
                teachers: totalTeachers,
                admins: totalAdmins,
                classes: totalClasses
            },
            finance: {
                totalCollected: totalCollectedFees,
                pendingFees: pendingFees > 0 ? pendingFees : 0,
                totalExpenses
            },
            attendance: {
                studentPercentage: studentAttendance,
                staffPercentage: staffAttendance
            },
            pendingActions: {
                complaints: pendingComplaints,
                leaveRequests: pendingLeaves,
                blockedStudents: blockedStudents,
                blockedStaff: blockedTeachers
            },
            recentAnnouncements: latestAnnouncements.map(a => ({
                title: a.title || "Untitled",
                description: a.content || "",
                date: a.activeTime ? new Date(a.activeTime) : new Date()
            }))
        };
    }
}
