export interface AdminDashboardDTO {
    recentAnnouncements: {
        title: string;
        description: string;
        date: Date;
    }[];
    counts: {
        students: number;
        teachers: number;
        admins: number;
        classes: number;
    };
    finance: {
        totalCollected: number;
        pendingFees: number; 
        totalExpenses: number;
    };
    attendance: {
        studentPercentage: number;
        staffPercentage: number;
    };
    pendingActions: {
        complaints: number;
        leaveRequests: number;
        blockedStudents: number;
        blockedStaff: number;
    };
}
