import { Meeting } from "../../../../domain/entities/Meeting";

export interface IGetScheduledMeetingsUseCase {
    execute(role?: string, classId?: string): Promise<Meeting[]>;
}
