import { Types } from "mongoose";
import { ExamEntity } from "../../../domain/entities/Exam/ExamEntity";
import { toExamEntity } from "../../mappers/ExamMapper";
import { IExamRepository } from "../../../domain/repositories/Exam/IExamRepoInterface";
import { ExamModel } from "../../database/models/ExamModel";

export class ExamMongoRepo implements IExamRepository {
  async createExam(data: ExamEntity): Promise<ExamEntity> {
    const examData = {
      examId: data.examId,
      title: data.title,
      type: data.type,
      classId: new Types.ObjectId(data.classId),
      className: data.className,
      division: data.division,
      subject: data.subject,
      teacherId: new Types.ObjectId(data.teacherId),
      teacherName: data.teacherName,
      examDate: data.examDate,
      startTime: data.startTime,
      endTime: data.endTime,
      maxMarks: data.maxMarks,
      passMarks: data.passMarks,
      description: data.description,
      status: data.status
    };
    const createdExam = await ExamModel.create(examData);
    return toExamEntity(createdExam);
  }

  async updateexam(id: string, data: Partial<ExamEntity>): Promise<ExamEntity | null> {
    const updateData: any = { ...data };
    if (data.classId) updateData.classId = new Types.ObjectId(data.classId);
    if (data.teacherId) updateData.teacherId = new Types.ObjectId(data.teacherId);

    const updatedExamDoc = await ExamModel.findByIdAndUpdate(
      id,
      { $set: updateData },
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
    }).sort({ examDate: -1 });
    console.log(exams)


    return exams.map(toExamEntity);
  }

  async findExamsByIds(examIds: string[]): Promise<ExamEntity[]> {
    const exams = await ExamModel.find({
      _id: { $in: examIds.map(id => new Types.ObjectId(id)) }
    }).sort({ examDate: -1 });
    return exams.map(toExamEntity);
  }
}
