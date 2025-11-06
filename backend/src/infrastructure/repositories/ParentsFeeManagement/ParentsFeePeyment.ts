
import { ParentSignupModel } from "../../database/models/ParentSignupModel"; 
import { ParentEntity } from "../../../domain/entities/Parents";
import { IParentFeeInterface } from "../../../domain/repositories/IParentFeeList";

export class ParentRepository implements IParentFeeInterface {
  
  async findByEmail(email: string): Promise<ParentEntity | null> {
    const parentDoc = await ParentSignupModel.findOne({ email }).exec();

    if (!parentDoc) return null;

    return new ParentEntity(
      parentDoc._id.toString(),
      parentDoc.email,
      parentDoc.password,
      parentDoc.student.toString() 
    );
  }

  async findByEmailAndStudentId(email: string, studentId: string): Promise<ParentEntity | null> {
    const parentDoc = await ParentSignupModel.findOne({ email })
      .populate("student", "studentId fullName classId")
      .exec();

    if (!parentDoc) return null;
    if (!parentDoc.student) return null;

    const linkedStudent = parentDoc.student;
    if (linkedStudent.studentId !== studentId) return null;

    return new ParentEntity(
      parentDoc._id.toString(),
      parentDoc.email,
      parentDoc.password,
      linkedStudent._id.toString()
    );
  }
}
