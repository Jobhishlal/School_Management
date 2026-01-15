import { Meeting } from "../../entities/Meeting";

export interface IValidateMeetingJoinUseCase {
    execute(meetingLink: string, userId: string, userRole: string, userClassId?: string, userStudentId?: string): Promise<{ authorized: boolean; meeting?: Meeting; message?: string }>;
}
