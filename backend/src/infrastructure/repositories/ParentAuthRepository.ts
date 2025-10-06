
import { ParentSignupModel } from "../database/models/ParentSignupModel";

export class ParentAuthRepository {
  async findByEmailAndStudentId(email: string, studentId: string) {

    const parent = await ParentSignupModel.findOne({ email })
      .populate("student", "studentId fullName")
      .exec();

    if (!parent) {
        console.log("why show this",parent)
      throw new Error("UserDoesNotExist");
    }

    
    if (!parent.student) {
      throw new Error("StudentNotLinked");
    }

    if (parent.student.studentId !== studentId) {
      throw new Error("StudentIdMismatch");
    }

    return parent;
  }
}
