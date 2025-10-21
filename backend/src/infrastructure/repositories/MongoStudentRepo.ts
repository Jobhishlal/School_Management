import { StudentModel, StudentInterface } from "../database/models/StudentModel";
import { Students } from "../../domain/entities/Students";
import { StudentDetails } from "../../domain/repositories/Admin/IStudnetRepository";
import mongoose from "mongoose";
import { ClassModel } from "../database/models/ClassModel";

export class MongoStudentRepo implements StudentDetails {
    private toObjectId(id: any) {
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ObjectId: ${id}`);
      }
      return new mongoose.Types.ObjectId(id);
    }


async create(student: Students): Promise<Students> {
  if (!student.classId && (!student.classDetails?.className || !student.classDetails.className)) {
    throw new Error("Student must have a classId or className+division");
  }

  let classObjectId;

  if (student.classId) {
    classObjectId =
      typeof student.classId === "string"
        ? new mongoose.Types.ObjectId(student.classId)
        : student.classId;

    const cls = await ClassModel.findById(classObjectId);
    if (!cls) throw new Error("Class does not exist");
  } else {
  
    const existingClass = await ClassModel.findOne({
      className: student.classDetails?.className,
      division: student.classDetails?.division,
    });

    if (existingClass) {
      classObjectId = existingClass._id;
    } else {
    
      const newClass = new ClassModel({
        className: student.classDetails?.className,
        division: student.classDetails?.division
      });
      const savedClass = await newClass.save();
      classObjectId = savedClass._id;
    }
  }

  const newStudent = new StudentModel({
    fullName: student.fullName,
    dateOfBirth: student.dateOfBirth,
    gender: student.gender,
    photos: student.photos,
    studentId: student.studentId,
    parent: this.toObjectId(student.parentId),
    address: this.toObjectId(student.addressId),
    classId: classObjectId,
    Password: student.Password,
    role: student.role,
  });

  const saved = await newStudent.save();
  await saved.populate([
    { path: "parent" },
    { path: "address" },
    { path: "classId", select: "className division" },
  ]);

  return this.mapToDomainPopulated(saved);
}


async findById(id: string): Promise<Students | null> {
  const student = await StudentModel.findById(id)
    .populate("parent")   
    .populate("address")  
    .populate("classId");

  if (!student) return null;
  return this.mapToDomainPopulated(student);
}
 async findStudentById(id: string): Promise<Students | null> {
    let studentdoc: StudentInterface | null = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
     
      studentdoc = await StudentModel.findById(id)
        .populate("parent")
        .populate("address")
        .populate("classId");
    }

    if (!studentdoc) {
      
      studentdoc = await StudentModel.findOne({ studentId: id })
        .populate("parent")
        .populate("address")
        .populate("classId");
    }

    if (!studentdoc) return null;

    return this.mapToDomainPopulated(studentdoc as any);
  }

   async getAllStudents(): Promise<Students[]> {
    console.log("all students",(await StudentModel.find()).length)
    const students = await StudentModel.find()
 
    .populate("parent")
    .populate("address")
    .populate("classId");

    return students.map(s => this.mapToDomainPopulated(s));
  }

  async updateBlockStatus(id: string, blocked: boolean): Promise<Students> {
    const updated = await StudentModel.findByIdAndUpdate(
      this.toObjectId(id),
      { blocked },
      { new: true }
    )
      .populate("parent")
      .populate("address")
      .populate("classId");

    if (!updated) throw new Error("Student not found for update");
    console.log("address",updated)

    return this.mapToDomainPopulated(updated);
  }

   async updateAll(id: string, update: Partial<Students>): Promise<Students | null> {
    const updated = await StudentModel.findByIdAndUpdate(
    this.toObjectId(id),
    {
      $set: {
        ...(update.fullName && { fullName: update.fullName }),
        ...(update.dateOfBirth && { dateOfBirth: update.dateOfBirth }),
        ...(update.gender && { gender: update.gender }),
        ...(update.photos && { photos: update.photos }),
        ...(update.studentId && { studentId: update.studentId }),
        ...(update.parentId && { parent: this.toObjectId(update.parentId) }),
        ...(update.addressId && { address: this.toObjectId(update.addressId) }),
        ...(update.classId && { classId: this.toObjectId(update.classId) }),
        ...(update.Password && { Password: update.Password }),
        ...(update.blocked !== undefined && { blocked: update.blocked }),
        ...(update.role&&{role:update.role})
      }
    },
    { new: true }
  )
    .populate("parent")
    .populate("address")
    .populate("classId");

  if (!updated) return null;

  return this.mapToDomainPopulated(updated);
}

  
    async findStudentid(studentId: string): Promise<Students | null> {
        
    
        const studentdoc = await StudentModel.findOne({ studentId: studentId })
            
            .populate("parent") 
            .populate("address") 
            .populate("classId"); 
        
      
        if (!studentdoc) {
            return null;
        }

       
        return this.mapToDomainPopulated(studentdoc as any); 
      
    }




private mapToDomainPopulated(student: StudentInterface & { parent: any; address: any; classId: any }): Students {
  return new Students(
    student._id.toString(),
    student.fullName,
    student.dateOfBirth,
    student.gender,
    student.studentId,
    student.parent?._id?.toString(),
    student.address?._id?.toString(),
    student.classId?._id?.toString(),
    student.photos.map(p => ({
      url: p.url,
      filename: p.filename,
      uploadedAt: p.uploadedAt
    })),
    student.Password,
    student.parent
      ? {
          name: student.parent.name,
          contactNumber: student.parent.contactNumber,
          email: student.parent.email,
          relationship: student.parent.relationship,
        }
      : undefined,
    student.classId
      ? {
          className: student.classId.className,
          division: student.classId.division,
          department: "N/A", 
          rollNumber: "N/A",  
        }
      : undefined,
    student.blocked ?? false,
    student.address
      ? {
          street: student.address.street,
          city: student.address.city,
          state: student.address.state,
          pincode: student.address.pincode,
        }
      : undefined,
    student.role
  );
}



}
