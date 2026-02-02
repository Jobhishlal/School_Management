import { IExamMarkRepository } from "../../../domain/repositories/Exam/IExamMarkRepoInterface";
import { ExamMarkModel } from "../../database/models/ExamMarkModel";
import { ExamMarkEntity } from "../../../domain/entities/Exam/ExamMarkEntity";
import { CreateExamMarkDTO } from "../../../applications/dto/Exam/CreateExamMarkDTO";
import { toExamMarkEntity } from "../../../domain/Mapper/ExamMarkMapper";
import { UpdateExamMarkDTO } from "../../../applications/dto/Exam/UpdateExamMarkDTO";
import { Types } from "mongoose";


export class ExamMarkMongoRepository implements IExamMarkRepository {

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
    const data = await ExamMarkModel.aggregate([
      {
        $match: {
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
          concern: 1,
          concernStatus: 1,
          concernResponse: 1,
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

    const data = await ExamMarkModel.find({
      studentId: new Types.ObjectId(studentId),
      examId: { $in: examIds.map(id => new Types.ObjectId(id)) },
    }).then(docs => docs.map(toExamMarkEntity));

    return data

  }


  async updateMark(id: string, updates: Partial<ExamMarkEntity>): Promise<ExamMarkEntity | null> {
    const updated = await ExamMarkModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );
    return updated ? toExamMarkEntity(updated) : null;
  }

  async updateConcern(id: string, concern: string): Promise<boolean> {
    const result = await ExamMarkModel.updateOne(
      { _id: new Types.ObjectId(id) },
      {
        $set: {
          concern: concern,
          concernStatus: "Pending"
        }
      }
    );
    return result.modifiedCount > 0;
  }

  async resolveConcern(id: string, status: "Resolved" | "Rejected", newMarks?: number, responseMessage?: string): Promise<boolean> {
    const updateQuery: any = {
      concernStatus: status
    };

    if (responseMessage) {
      updateQuery.concernResponse = responseMessage;
    }

    if (newMarks !== undefined) {
      updateQuery.marksObtained = newMarks;

      updateQuery.progress = newMarks >= 90 ? "EXCELLENT" : newMarks >= 70 ? "GOOD" : newMarks >= 40 ? "NEEDS_IMPROVEMENT" : "POOR";
    }

    const result = await ExamMarkModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: updateQuery }
    );
    return result.modifiedCount > 0;
  }
  getPendingConcernsInfoByExamIds(examIds: string[]): Promise<Record<string, Array<{ studentName: string, concern: string, studentId: string }>>> {
    const ids = examIds.map((id) => new Types.ObjectId(id));
    return ExamMarkModel.aggregate([
      {
        $match: {
          examId: { $in: ids },
          concernStatus: "Pending",
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
      {
        $unwind: {
          path: "$student",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          examId: 1,
          concern: 1,
          studentName: "$student.fullName",
          studentId: "$student.studentId",
        },
      },
    ]).then((results) => {
      const map: Record<string, Array<{ studentName: string, concern: string, studentId: string }>> = {};

      results.forEach((r) => {
        const eId = r.examId.toString();
        if (!map[eId]) {
          map[eId] = [];
        }
        map[eId].push({
          studentName: r.studentName || "Unknown",
          concern: r.concern || "",
          studentId: r.studentId || "N/A"
        });
      });
      return map;
    });
  }

  async findAllMarksByStudentId(studentId: string): Promise<ExamMarkEntity[]> {
    if (!Types.ObjectId.isValid(studentId)) {
      return [];
    }

    const docs = await ExamMarkModel.find({
      studentId: new Types.ObjectId(studentId)
    });

    return docs.map(toExamMarkEntity);
  }

  async calculateClassAverage(classId: string): Promise<{ average: number, trend: number }> {
    const result = await ExamMarkModel.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "_id",
          as: "student"
        }
      },
      { $unwind: "$student" },
      { $match: { "student.classId": new Types.ObjectId(classId) } },
      {
        $group: {
          _id: null,
          avgMarks: { $avg: "$marksObtained" }
        }
      }
    ]);

    const average = result.length > 0 ? Math.round(result[0].avgMarks) : 0;
    return { average, trend: 1 }; // Mock trend
  }

  async calculateSchoolAverage(): Promise<number> {
    const result = await ExamMarkModel.aggregate([
      {
        $group: {
          _id: null,
          avgMarks: { $avg: "$marksObtained" }
        }
      }
    ]);

    return result.length > 0 ? Math.round(result[0].avgMarks) : 0;
  }

  async getClassPerformanceHistory(classId: string): Promise<Array<{ month: string, avg: number }>> {
    // This is complex as ExamMark doesn't have date directly, it's in Exam.
    // Need to lookup Exam to get date.

    const result = await ExamMarkModel.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "_id",
          as: "student"
        }
      },
      { $unwind: "$student" },
      { $match: { "student.classId": new Types.ObjectId(classId) } },
      {
        $lookup: {
          from: "exams",
          localField: "examId",
          foreignField: "_id",
          as: "exam"
        }
      },
      { $unwind: "$exam" },
      {
        $group: {
          _id: { $month: "$exam.examDate" }, // Assuming examDate exists
          avg: { $avg: "$marksObtained" },
          year: { $first: { $year: "$exam.examDate" } }
        }
      },
      { $sort: { year: 1, _id: 1 } }
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return result.map(r => ({
      month: months[r._id - 1] || "Unknown",
      avg: Math.round(r.avg)
    }));
  }

  async getTopPerformingStudents(classId: string, limit: number): Promise<any[]> {
    const result = await ExamMarkModel.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },
      { $match: { "student.classId": new Types.ObjectId(classId) } },
      {
        $group: {
          _id: "$studentId",
          fullName: { $first: "$student.fullName" },
          studentId: { $first: "$student.studentId" },
          avgMarks: { $avg: "$marksObtained" },
          photo: { $first: { $arrayElemAt: ["$student.photos.url", 0] } }
        },
      },
      { $sort: { avgMarks: -1 } },
      { $limit: limit },
    ]);
    return result;
  }

  async getLowPerformingStudents(classId: string, limit: number): Promise<any[]> {
    const result = await ExamMarkModel.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },
      { $match: { "student.classId": new Types.ObjectId(classId) } },
      {
        $group: {
          _id: "$studentId",
          fullName: { $first: "$student.fullName" },
          studentId: { $first: "$student.studentId" },
          avgMarks: { $avg: "$marksObtained" },
        },
      },
      { $sort: { avgMarks: 1 } },
      { $limit: limit },
    ]);
    return result;
  }
}