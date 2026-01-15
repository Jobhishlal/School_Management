import { Meeting } from "../../entities/Meeting";

export interface IGetAllMeetingsUseCase {
    execute(): Promise<Meeting[]>;
}
