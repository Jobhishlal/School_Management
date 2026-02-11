import { IMeetingRepository } from "../../interface/RepositoryInterface/IMeetingRepository";
import { IGetMeetingByLinkUseCase } from "../../interface/UseCaseInterface/Meeting/IGetMeetingByLinkUseCase";
import { Meeting } from "../../../domain/entities/Meeting";

export class GetMeetingByLinkUseCase implements IGetMeetingByLinkUseCase {
    constructor(private readonly meetingRepository: IMeetingRepository) { }

    async execute(link: string): Promise<Meeting | null> {
        return await this.meetingRepository.getMeetingByLink(link);
    }
}
