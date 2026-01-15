import { Meeting } from "../../entities/Meeting";

export interface IGetScheduledMeetingsUseCase {
    execute(role?: string, classId?: string): Promise<Meeting[]>;
}
