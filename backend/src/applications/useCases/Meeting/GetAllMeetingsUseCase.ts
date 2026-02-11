import { IMeetingRepository } from "../../interface/RepositoryInterface/IMeetingRepository";
import { IGetAllMeetingsUseCase } from "../../interface/UseCaseInterface/Meeting/IGetAllMeetingsUseCase";
import { Meeting } from "../../../domain/entities/Meeting";

export class GetAllMeetingsUseCase implements IGetAllMeetingsUseCase {
    constructor(private readonly meetingRepository: IMeetingRepository) { }

    async execute(): Promise<Meeting[]> {
        return await this.meetingRepository.getAllMeetings();
    }
}
