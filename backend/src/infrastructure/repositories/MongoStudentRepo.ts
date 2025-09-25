import { StudentModel, StudentInterface } from "../database/models/StudentModel";
import { Students } from "../../domain/entities/Students";
import { StudentDetails } from "../../domain/repositories/Admin/IStudnetRepository";
import mongoose from "mongoose";




export class MongoStudentRepo implements StudentDetails {

  private toObjectId(id: any) {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(`Invalid ObjectId: ${id}`);
    }
    return new mongoose.Types.ObjectId(id);
  }

async create(student: Students): Promise<Students> {
  const newStudent = new StudentModel({
    fullName: student.fullName,
    dateOfBirth: student.dateOfBirth,
    gender: student.gender,
    photos: student.photos,
    studentId: student.studentId,
    parent: this.toObjectId(student.parentId),  
    address: this.toObjectId(student.addressId),
    classId: this.toObjectId(student.classId),
    Password: student.Password
  });

  const saved = await newStudent.save();

  await saved.populate([
    { path: "parent" },
    { path: "address" },
    { path: "classId" }
  ]);

  return this.mapToDomainPopulated(saved);
}
  async findByStudentId(studentId: string): Promise<Students | null> {
    const student = await StudentModel.findOne({ studentId })
      .populate("parent")
      .populate("address")
      .populate("classId");

    return student ? this.mapToDomainPopulated(student) : null;
  }

   async getAllStudents(): Promise<Students[]> {
    const student = await StudentModel.find()    
   .populate("parent").
    populate("address").
    populate("classId")

    return student.map(student=>this.mapToDomainPopulated(student))
}

private mapToDomainPopulated(student: StudentInterface & { parent: any; address: any; classId: any; }): Students {
  return new Students(
    student._id.toString(),
    student.fullName,
    student.dateOfBirth,
    student.gender,
    student.studentId,
    student.parent?._id.toString(),  
    student.address?._id.toString(),  
    student.classId?._id.toString(),  
    student.photos.map(p => ({
      url: p.url,
      filename: p.filename,
      uploadedAt: p.uploadedAt
    })),
    student.Password,
     student.parent,     
    student.classId  
  );

}



}
