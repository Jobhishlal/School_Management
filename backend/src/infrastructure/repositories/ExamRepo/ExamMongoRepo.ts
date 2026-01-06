import { Types } from "mongoose";
import { CreateExamDTO } from "../../../applications/dto/Exam/CreateExamDTO";
import { ExamEntity } from "../../../domain/entities/Exam/ExamEntity";
import { toExamEntity } from "../../../domain/Mapper/ExamCreateMapper";
import { IExamRepository } from "../../../domain/repositories/Exam/IExamRepoInterface";
import { ExamModel } from "../../database/models/ExamModel";
import { UpdateExamDTO } from "../../../applications/dto/Exam/UpdateExamDTO";
import { StudentModel } from "../../database/models/StudentModel";


export class ExamMongoRepo implements IExamRepository {
  async createExam(data: CreateExamDTO): Promise<ExamEntity> {
    const examData = {
      ...data,
      classId: new Types.ObjectId(data.classId),
      teacherId: new Types.ObjectId(data.teacherId)
    };
    const createdExam = await ExamModel.create(examData);
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
    const exams = await ExamModel.find({ teacherId: new Types.ObjectId(teacherId) }).sort({ _id: -1 });
    return exams.map(toExamEntity);
  }
  async getExamsByTeacherWithStudents(classId: string) {

    const exams = await ExamModel.find({
      classId: new Types.ObjectId(classId),
    });
    return exams.map(toExamEntity);

  }
  async findById(examId: string): Promise<ExamEntity | null> {
    if (!Types.ObjectId.isValid(examId)) {
      return null;
    }

    const exam = await ExamModel.findById(examId);
    return exam ? toExamEntity(exam) : null;
  }
  async findByClassAndTeacher(classId: string, teacherId: string): Promise<ExamEntity[]> {
    const exams = await ExamModel.find({
      classId,
      teacherId,
    });

    return exams.map(toExamEntity);
  }
  async findPublishedExamsByClass(classId: string): Promise<ExamEntity[]> {
    const exams = await ExamModel.find({
      classId: new Types.ObjectId(classId),
    }).sort({ examDate: 1 });
    console.log(exams)


    return exams.map(toExamEntity);
  }
}
