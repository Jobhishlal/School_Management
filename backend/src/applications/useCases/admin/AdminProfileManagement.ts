
import {SubAdminRepository} from "../../interface/RepositoryInterface/SubAdminCreate";
import { ISubAdminProfileGetUseCase } from "../../interface/UseCaseInterface/ISubAdminProfile";
import { SubAdminEntities } from "../../../domain/entities/SubAdmin";

export class SubAdminProfileGetUseCase implements ISubAdminProfileGetUseCase {
  constructor(private _subadminrepo: SubAdminRepository) {}

  async execute(id: string): Promise<SubAdminEntities | null> {
    return await this._subadminrepo.findById(id);
  }
}
