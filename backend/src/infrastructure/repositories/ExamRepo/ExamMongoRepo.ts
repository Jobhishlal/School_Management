import { Types } from "mongoose";
import { CreateExamDTO } from "../../../applications/dto/Exam/CreateExamDTO";
import { ExamEntity } from "../../../domain/entities/Exam/ExamEntity";
import { toExamEntity } from "../../../domain/Mapper/ExamCreateMapper";
import { IExamRepository } from "../../../domain/repositories/Exam/IExamRepoInterface";
import { ExamModel } from "../../database/models/ExamModel";
import { UpdateExamDTO } from "../../../applications/dto/Exam/UpdateExamDTO";

export class ExamMongoRepo implements IExamRepository {
  async createExam(data: CreateExamDTO): Promise<ExamEntity> {
    const createdExam = await ExamModel.create(data);
    return toExamEntity(createdExam);
  }

async updateexam(id: string, data: UpdateExamDTO): Promise<ExamEntity | null> {
  const updatedExamDoc = await ExamModel.findByIdAndUpdate(
    id,       
    { $set: data },
    { new: true }
  );
  return updatedExamDoc ? toExamEntity(updatedExamDoc) : null;
}

 async getExamsByTeacher(teacherId: string): Promise<ExamEntity[]> {
      const exams = await ExamModel.find({ teacherId: new Types.ObjectId(teacherId) });
    return exams.map(toExamEntity);
  }
 }
  
  

