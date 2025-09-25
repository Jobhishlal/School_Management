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
      subjects: data.subjects 
    });

    const saved = await newClass.save();

    return new Class(
      (saved._id as mongoose.Types.ObjectId).toString(),
      saved.className,
      saved.division,
      saved.rollNumber,
      saved.department,
      saved.subjects
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
}
