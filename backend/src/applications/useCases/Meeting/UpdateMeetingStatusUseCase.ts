import { IMeetingRepository } from "../../../domain/repositories/IMeetingRepository";
import { IUpdateMeetingStatusUseCase } from "../../../domain/UseCaseInterface/Meeting/IUpdateMeetingStatusUseCase";
import { Meeting } from "../../../domain/entities/Meeting";

export class UpdateMeetingStatusUseCase implements IUpdateMeetingStatusUseCase {
    constructor(private readonly meetingRepository: IMeetingRepository) { }

    async execute(meetingId: string, status: 'scheduled' | 'live' | 'ended'): Promise<Meeting | null> {
        return await this.meetingRepository.updateMeetingStatus(meetingId, status);
    }
}
