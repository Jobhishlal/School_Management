export interface StudentPerformanceDTO {
    attendancePercentage: number;
    examPerformance: {
        examName: string;
        subject: string;
        marksObtained: number;
        maxMarks: number;
        grade: string;
    }[];
    overallGrade: string;
}