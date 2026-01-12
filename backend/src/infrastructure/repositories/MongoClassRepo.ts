import { throwDeprecation } from "process";
import { Class } from "../../domain/entities/Class";
import { IClassRepository } from "../../domain/repositories/Classrepo/IClassRepository";

import { ClassModel } from "../database/models/ClassModel";

import mongoose from "mongoose";
import { StudentModel } from "../database/models/StudentModel";

export class MongoClassRepository implements IClassRepository {

  async create(data: Class): Promise<Class> {

    const existing = await ClassModel.findOne({
      className: data.className,
      division: data.division,
    });

    if (existing) {
      throw new Error(`Class ${data.className}${data.division} already exists`);
    }


    const newClass = new ClassModel({
      className: data.className,
      division: data.division,
      department: data.department,
      rollNumber: data.rollNumber,
      subjects: data.subjects || [],
      classTeacher: data.classTeacher || null,
    });

    const saved = await newClass.save();

    return new Class(
      (saved._id as mongoose.Types.ObjectId).toString(),
      saved.className,
      saved.division,
      saved.rollNumber,
      saved.department,
      saved.subjects,
      saved.classTeacher?.toString(),
    );
  }

  async getAll(): Promise<Class[]> {
    const classes = await ClassModel.find();

    return classes.map((c) =>
      new Class(
        (c._id as mongoose.Types.ObjectId).toString(),
        c.className,
        c.division,
        c.rollNumber,
        c.department,
        c.subjects
      )
    );
  }
  async updateClass(id: string, update: Partial<Class>): Promise<Class | null> {

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(`Invalid Class ID: ${id}`);
    }


    const updatedClass = await ClassModel.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    );

    if (!updatedClass) return null;

    return new Class(
      updatedClass.id.toString(),
      updatedClass.className,
      updatedClass.division,
      updatedClass.rollNumber,
      updatedClass.department,
      updatedClass.subjects
    );
  }
  async assignClassWithDivision(className: string): Promise<Class | null> {
    const maxStudents = 20;
    const divisions = ["A", "B", "C", "D"];

    for (const division of divisions) {

      const count = await ClassModel.countDocuments({ className, division });

      if (count < maxStudents) {

        let existing = await ClassModel.findOne({ className, division });

        if (!existing) {
          existing = await ClassModel.create({
            className,
            division,
            rollNumber: "",
            department: undefined,
            subjects: []
          });
        }


        return new Class(
          (existing._id as mongoose.Types.ObjectId).toString(),
          existing.className,
          existing.division,
          existing.rollNumber,
          existing.department,
          existing.subjects
        );
      }
    }


    return null;
  }
  async findById(id: string): Promise<Class> {

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(`Invalid Class ID: ${id}`);
    }

    const classDoc = await ClassModel.findById(id);


    if (!classDoc) {
      throw new Error("Id cannot find")
    }

    return new Class(
      classDoc.id,
      classDoc.className,
      classDoc.division,
      classDoc.rollNumber,
      classDoc.department,
      classDoc.subjects,
      classDoc.classTeacher?.toString()
    );
  }

  async assignStudentToClass(studentId: string, classId: string): Promise<boolean> {
    const updated = await StudentModel.findByIdAndUpdate(
      studentId,
      { classId },
      { new: true }
    );

    return !!updated;
  }

  async assignManyStudentsToClass(studentIds: string[], classId: string): Promise<boolean> {
    const updated = await StudentModel.updateMany(
      { studentId: { $in: studentIds } },
      { $set: { classId } }
    );
    return updated.modifiedCount > 0;
  }



  async deleteClass(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(`Invalid Class ID: ${id}`);
    }


    const studentCount = await StudentModel.countDocuments({ classId: id });
    if (studentCount > 0) {
      throw new Error(`Cannot delete class. It has ${studentCount} students assigned.`);
    }

    const deleted = await ClassModel.findByIdAndDelete(id);
    return !!deleted;
  }

  async findByTeacherId(teacherId: string): Promise<Class | null> {
    const classDoc = await ClassModel.findOne({ classTeacher: new mongoose.Types.ObjectId(teacherId) }).populate('classTeacher');
    if (!classDoc) return null;

    // Convert populated classTeacher to any to access name safely, or keep as string if not populated
    const teacherName = (classDoc.classTeacher as any)?.name || (classDoc.classTeacher as any)?.fullName;

    // We are returning a Domain Class object. The Domain Class object takes classTeacher as string.
    // So we can't easily pass the name through the Class entity unless we change the entity.
    // However, the Use Case returns ClassDetailsDTO.
    // I can modify ClassDetailsDTO to include `teacherName`.
    // But `findByTeacherId` returns `Class`.
    /* 
       Optimally, I should keep Repo returning `Class` entity.
       And UseCase should fetch Teacher Name.
    */
    return new Class(
      (classDoc._id as mongoose.Types.ObjectId).toString(),
      classDoc.className,
      classDoc.division,
      classDoc.rollNumber,
      classDoc.department,
      classDoc.subjects,
      classDoc.classTeacher?._id?.toString() || classDoc.classTeacher?.toString() // Handle both populated and unpopulated
    );
  }
}



