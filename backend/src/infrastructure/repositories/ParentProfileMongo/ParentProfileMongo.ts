import { IParentProfileRepository } from "../../../domain/repositories/ParentProfile/IParentProfile";
import { ParentModel } from "../../database/models/ParentsModel";
import { ParentSignupModel } from "../../database/models/ParentSignupModel";
import { StudentModel } from "../../database/models/StudentModel";
import { AddressModel } from "../../database/models/AddressModel";
import { ClassModel } from "../../database/models/ClassModel";

export class ParentProfileRepository implements IParentProfileRepository {

  async getParentSignupById(id: string) {
    return ParentSignupModel.findById(id);
  }

  async getStudentById(id: string) {
    return StudentModel.findById(id);
  }

  async getParentById(id: string) {
    return ParentModel.findById(id);
  }

  async getAddressById(id: string) {
    return AddressModel.findById(id);
  }

  async getClassById(id: string) {
    return ClassModel.findById(id);
  }
}
