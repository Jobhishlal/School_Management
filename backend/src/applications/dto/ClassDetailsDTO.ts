import { Class } from "../../domain/entities/Class";

export interface StudentDTO {
    id: string;
    fullName: string;
    dateOfBirth: Date;
    gender: "Male" | "Female" | "Other";
    studentId: string;
    parentId: string;
    addressId: string;
    classId: string;
    photos: { url: string; filename: string; uploadedAt: Date }[];
    Password: string;
    parent?: { id: string; name: string; contactNumber: string; whatsappNumber?: string; email?: string; relationship?: string };
    classDetails?: { id: string; className: string; division: string; department: string; rollNumber: string };
    blocked: boolean;
    address?: { id: string; street?: string; city?: string; state?: string; pincode?: string };
    role?: string;
    attendancePercentage: number;
}

export interface ClassDetailsDTO {
    classInfo: Class;
    students: StudentDTO[];
    totalStudents: number;
    teacherName: string;
    totalCount: number;
    stats: {
        attendance: { percentage: number, trend: number };
        performance: { average: number, trend: number };
        schoolAverage: number;
        history: Array<{ month: string, avg: number }>;
        topStudents: Array<{ _id: string, fullName: string, studentId: string, avgMarks: number }>;
        weakStudents: Array<{ _id: string, fullName: string, studentId: string, avgMarks: number }>;
    }
}
