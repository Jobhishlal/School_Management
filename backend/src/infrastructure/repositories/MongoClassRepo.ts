import { Class } from "../../domain/entities/Class";
import { IClassRepository } from "../../domain/repositories/Classrepo/IClassRepository";

import { ClassModel } from "../database/models/ClassModel";

import mongoose from "mongoose";

export class MongoClassRepository implements IClassRepository {
  async create(data: Class): Promise<Class> {
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
      saved.classTeacher?.toString() ,

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


}



