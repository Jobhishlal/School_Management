import { IExamMarkRepository } from "../../../domain/repositories/Exam/IExamMarkRepoInterface";
import { ExamMarkModel } from "../../database/models/ExamMarkModel";
import { ExamMarkEntity } from "../../../domain/entities/Exam/ExamMarkEntity";
import { CreateExamMarkDTO } from "../../../applications/dto/Exam/CreateExamMarkDTO";
import { toExamMarkEntity } from "../../../domain/Mapper/ExamMarkMapper";
import { UpdateExamMarkDTO } from "../../../applications/dto/Exam/UpdateExamMarkDTO";
import { Types } from "mongoose";


export class ExamMarkMongoRepository implements IExamMarkRepository{
   
    async create(data: CreateExamMarkDTO): Promise<ExamMarkEntity> {
        const create = await ExamMarkModel.create(data)
        return toExamMarkEntity(create)
    }
    async update(id: string, data: UpdateExamMarkDTO): Promise<ExamMarkEntity | null> {
        const updated = await ExamMarkModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );

    return updated ? toExamMarkEntity(updated) : null;
    }
    async findByExamAndStudent(examId: string, studentId: string): Promise<ExamMarkEntity | null> {
        if (!Types.ObjectId.isValid(examId) || !Types.ObjectId.isValid(studentId)) {
      return null;
    }

    const existing = await ExamMarkModel.findOne({
      examId: new Types.ObjectId(examId),
      studentId: new Types.ObjectId(studentId),
    });

    return existing ? toExamMarkEntity(existing) : null;
    }

        async findClassResults(
        classId: string,
        teacherId: string,
      examId: string
): Promise<any[]> {
  const data =await ExamMarkModel.aggregate([
    {
      $match: {
        classId: new Types.ObjectId(classId),
        teacherId: new Types.ObjectId(teacherId),
        examId: new Types.ObjectId(examId), 
      },
    },
    {
      $lookup: {
        from: "students",
        localField: "studentId",
        foreignField: "_id",
        as: "student",
      },
    },
    { $unwind: { path: "$student", preserveNullAndEmptyArrays: true } }, 
    {
      $project: {
        _id: 1,
        examId: 1,
        studentId: 1,
        marksObtained: 1,
        progress: 1,
        remarks: 1,
        studentFullName: "$student.fullName",
        studentRollNo: "$student.studentId",
      },
    },
  ]);


  console.log(data)
  return data
}

async findMarksForStudent(
  studentId: string,
  examIds: string[]
): Promise<ExamMarkEntity[]> {
   
  const data =await ExamMarkModel.find({
    studentId: new Types.ObjectId(studentId),
    examId: { $in: examIds.map(id => new Types.ObjectId(id)) },
  }).then(docs => docs.map(toExamMarkEntity));
  console.log(data)
  return data

}


  
}