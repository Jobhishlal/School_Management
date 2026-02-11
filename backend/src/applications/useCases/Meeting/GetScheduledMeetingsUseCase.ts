import { IMeetingRepository } from "../../interface/RepositoryInterface/IMeetingRepository";
import { IGetScheduledMeetingsUseCase } from "../../interface/UseCaseInterface/Meeting/IGetScheduledMeetingsUseCase";
import { Meeting } from "../../../domain/entities/Meeting";

export class GetScheduledMeetingsUseCase implements IGetScheduledMeetingsUseCase {
    constructor(private readonly meetingRepository: IMeetingRepository) { }

    async execute(role?: string, classId?: string): Promise<Meeting[]> {
        return await this.meetingRepository.getScheduledMeetings({ role, classId });
    }
}
