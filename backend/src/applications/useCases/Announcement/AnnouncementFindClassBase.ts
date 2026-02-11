import { IAnnoucementfindclassBase } from "../../interface/UseCaseInterface/Announcement/IAnnouncementReadUseCase";
import { IAnnouncementRepository } from "../../interface/RepositoryInterface/Announcement/IAnnouncement";
import { Announcement } from "../../../domain/entities/Announcement/Announcement";
import { CreateAnnouncementInput } from "../../dto/CreateAnnouncementInput";

export class ClassBaseFindAnnouncementUseCase
  implements IAnnoucementfindclassBase {

  constructor(private readonly repo: IAnnouncementRepository) {}

  async execute(input: CreateAnnouncementInput): Promise<Announcement[]> {
    if (!input.classes || input.classes.length === 0) {
        throw new Error("At least one class must be assigned");
    }

    const classId = input.classes[0]; 
    const data = await this.repo.findForClass(classId); 
    console.log("daata",data)
    return data;
  }
}
