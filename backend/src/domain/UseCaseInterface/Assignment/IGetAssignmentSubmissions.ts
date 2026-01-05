
export interface SubmissionResult {
    studentId: string;
    studentName: string;
    admissionNumber: string;
    submitted: boolean;
    submissionDate?: Date;
    fileUrl?: string;
    fileName?: string;
    grade?: number;
    feedback?: string;
    badge?: string;
    status: string;
}

export interface IGetAssignmentSubmissions {
    execute(assignmentId: string): Promise<SubmissionResult[]>;
}
