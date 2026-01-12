import { ParentSignUpEntity } from "../../domain/entities/ParentSignupEntity";
import { ParentSignupModel } from "../database/models/ParentSignupModel";
import { StudentModel } from "../database/models/StudentModel";
import { IParentRepositorySign } from "../../domain/repositories/Auth/IParentRepository";
import bcrypt from 'bcrypt'

export class MongoParentSignUp implements IParentRepositorySign {
  async findByEmail(email: string): Promise<ParentSignUpEntity | null> {

    const parent = await ParentSignupModel.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } })
      .populate({
        path: "student",
        select: "studentId fullName",
        strictPopulate: false,
      });
    console.log("parent", parent)

    if (!parent) return null;

    const studentId = parent.student ? parent.student.studentId : "";
    return new ParentSignUpEntity(
      parent._id.toString(),
      parent.email,
      parent.password,
      studentId
    );
  }


  async create(parent: ParentSignUpEntity): Promise<ParentSignUpEntity> {
    const student = await StudentModel.findOne({ studentId: parent.studentId });
    if (!student) throw new Error("Student not found");

    const newParent = new ParentSignupModel({
      email: parent.email,
      password: parent.password,
      student: student._id,
    });

    const saved = await newParent.save();
    return new ParentSignUpEntity(saved._id.toString(), saved.email, saved.password, student.studentId);
  }

  async findStudentById(studentId: string) {
    return await StudentModel.findOne({ studentId });
  }

  async linkParenttoStudent(studentId: string, parentId: string) {
    await StudentModel.updateOne({ studentId }, { parent: parentId });
  }
  async updatePassword(email: string, newPassword: string): Promise<ParentSignUpEntity> {
    const parent = await ParentSignupModel.findOne({ email });
    if (!parent) throw new Error("Parent not found");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    parent.password = hashedPassword;
    await parent.save();

    const studentId = parent.student ? (parent.student as any).studentId : "";
    return new ParentSignUpEntity(parent._id.toString(), parent.email, parent.password, studentId);
  }

  async findById(id: string): Promise<ParentSignUpEntity | null> {
    const parent = await ParentSignupModel.findById(id).populate({
      path: "student",
      select: "studentId fullName",
      strictPopulate: false,
    });
    if (!parent) return null;
    const studentId = parent.student ? (parent.student as any).studentId : "";
    return new ParentSignUpEntity(parent._id.toString(), parent.email, parent.password, studentId);
  }
}
