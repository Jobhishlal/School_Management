import { IMeetingRepository } from "../../../domain/repositories/IMeetingRepository";
import { IGetMeetingByLinkUseCase } from "../../../domain/UseCaseInterface/Meeting/IGetMeetingByLinkUseCase";
import { Meeting } from "../../../domain/entities/Meeting";

export class GetMeetingByLinkUseCase implements IGetMeetingByLinkUseCase {
    constructor(private readonly meetingRepository: IMeetingRepository) { }

    async execute(link: string): Promise<Meeting | null> {
        return await this.meetingRepository.getMeetingByLink(link);
    }
}
