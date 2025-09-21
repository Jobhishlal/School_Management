

import { Request, Response } from "express";
import { StudentAddUseCase } from "../../../../applications/useCases/Students/CreateStudents";
import { MongoStudentRepo } from "../../../../infrastructure/repositories/MongoStudentRepo";
import { Students } from "../../../../domain/entities/Students";
import passport from "passport";

export class StudentCreateController {
  constructor(
    private studentRepo: MongoStudentRepo,
    private addStudent: StudentAddUseCase
  ) {}

async create(req: Request, res: Response): Promise<void> {
  try {
    console.log("req.body:", req.body);  
    console.log("req.files:", req.files); 

    const { fullName, dateOfBirth, gender, studentId, parentId, addressId, classId,Password } = req.body;

    const photos =
      (req.files as Express.Multer.File[])?.map(file => ({
        url: (file as any).path,
        filename: file.filename,
        uploadedAt: new Date(),
      })) || [];

    const student = new Students(
      "",
      fullName,
      new Date(dateOfBirth),
      gender,
      studentId,
      parentId,
      addressId,
      classId,
      photos,
      Password
    );

    const created = await this.addStudent.execute(student);

    res.status(201).json({ message: "Student created successfully", student: created });
  } catch (error: any) {
    console.error("Error creating student:", error);
    res.status(500).json({ message: "Failed to create student", error: error.message });
  }
}

}