import { Meeting } from "../../../../domain/entities/Meeting";

export interface IGetAllMeetingsUseCase {
    execute(): Promise<Meeting[]>;
}
