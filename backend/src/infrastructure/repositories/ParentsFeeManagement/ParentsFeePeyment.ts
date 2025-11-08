import { ParentSignupModel } from "../../database/models/ParentSignupModel"; 
import { ParentEntity } from "../../../domain/entities/Parents";
import { IParentFeeInterface } from "../../../domain/repositories/IParentFeeList";
import { FeeStructureModel } from "../../database/models/FeeManagement/FeeStructure";
import { StudentModel } from "../../database/models/StudentModel";


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

  async findByEmailAndStudentId(email: string, studentId: string): Promise<any> {
    const parentDoc = await ParentSignupModel.findOne({ email })
      .populate("student", "studentId fullName classId")
      .exec();

    if (!parentDoc || !parentDoc.student) return null;

    const student = await StudentModel.findOne({ studentId })
      .populate("classId", "className division")
      .lean();

    if (!student) return null;

    const feeStructures = await FeeStructureModel.find({
      classId: student.classId._id,
    }).lean();

    return {
      parentId: parentDoc._id,
      email: parentDoc.email,
      student: {
        _id: student._id,
        fullName: student.fullName,
        studentId: student.studentId,
        class: student.classId,
        finance: feeStructures,
      },
    };
  }
}
