import { StudentDetails } from "../../interface/RepositoryInterface/Admin/IStudnetRepository";
import { ITeacherCreate } from "../../interface/RepositoryInterface/TeacherCreate";
import { ISubadminLogin } from "../../interface/RepositoryInterface/IAdminRepoLogin";
import { IClassRepository } from "../../interface/RepositoryInterface/Classrepo/IClassRepository";
import { IAnnouncementRepository } from "../../interface/RepositoryInterface/Announcement/IAnnouncement";
import { IFeeStructureRepository } from "../../interface/RepositoryInterface/FeeDetails/IFeeStructureRepository";
import { IPaymentTransactionRepository } from "../../interface/RepositoryInterface/FeeDetails/IPaymentTransactionRepository";
import { IExpenseRepository } from "../../interface/RepositoryInterface/FeeDetails/IExpesnseRepositoy";
import { IAttandanceRepository } from "../../interface/RepositoryInterface/Attandance/IAttendanceRepository";
import { InterfaceLeaveManagement } from "../../interface/RepositoryInterface/ILeaveManagement/ILeaveManagement";
import { AdminDashboardDTO } from "../../dto/AdminDashboardDTO";

import { IGetAdminDashboardUseCase } from "../../interface/UseCaseInterface/IGetAdminDashboardUseCase";

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
            pendingComplaints, 
            pendingLeaves,
            blockedUsers 
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
            Promise.resolve(0), 
            this.leaveRepo.countPendingRequests(),
            Promise.resolve(0) 
        ]);

        const blockedStudents = await this.studentRepo.countBlocked();
        const blockedTeachers = await this.teacherRepo.countBlocked();
       
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
