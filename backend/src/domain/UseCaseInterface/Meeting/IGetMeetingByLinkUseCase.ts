import { Meeting } from "../../entities/Meeting";

export interface IGetMeetingByLinkUseCase {
    execute(link: string): Promise<Meeting | null>;
}
