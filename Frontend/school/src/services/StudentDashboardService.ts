import api from './api';

export interface DashboardData {
    todayClasses: any[]
    attendancePercentage: number;
    pendingAssignments: any[];
    upcomingExams: any[];
    announcements: any[];
}

export const getStudentDashboard = async (): Promise<DashboardData> => {
    const response = await api.get('/student/dashboard');
    return response.data;
};
