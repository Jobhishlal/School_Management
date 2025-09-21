import { StudentModel, StudentInterface } from "../database/models/StudentModel";
import { Students } from "../../domain/entities/Students";
import { StudentDetails } from "../../domain/repositories/IStudnetRepository";
import mongoose from "mongoose";


interface ParentInterface {
  id: string;
  name: string;
  contactNumber: string;
  email?: string;
  relationship: "Son" | "Daughter";
}

interface AddressInterface {
  id: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

interface ClassInterface {
  id: string;
  className: string;
  division: string;
  department: "LP" | "UP" | "HS";
  rollNumber: string;
  subjects: string[];
}

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
    student.Password
  );
}

}
