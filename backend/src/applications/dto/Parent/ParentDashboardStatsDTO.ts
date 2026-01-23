export interface ParentDashboardStatsDTO {
    studentProfile: {
        name: string;
        rollNo: string;
        className: string;
        section: string;
        age: number;
        bloodGroup: string;
        photo?: string;
    };
    attendance: {
        totalClasses: number;
        present: number;
        absent: number;
        leave: number;
        percentage: number;
    };
    examStats: {
        marksTrend: { name: string; value: number }[];
        subjectComparison: { name: string; value: number }[];
        passFailRatio: { name: string; value: number; color: string }[];
    };
}
