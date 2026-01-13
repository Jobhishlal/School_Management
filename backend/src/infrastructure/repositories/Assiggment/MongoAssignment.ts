import { BaseRepository } from "../BASEREPOSITORIES/Baserepository";
import { AssignmentEntity } from "../../../domain/entities/Assignment";
import { AssignmentModel, AssignmentDocument } from "../../database/models/Teacher/Assignment";
import mongoose, { Types } from "mongoose";
import { IAssignmentRepository, TeacherTimetableInfo } from "../../../domain/repositories/Assignment/IAssignmentRepository ";
import { TeacherModel } from "../../database/models/Teachers";
import { TimetableModel } from "../../database/models/Admin/TimeTableCraete";
import { AssignmentDTO } from "../../../applications/dto/AssignmentDTO ";
import { StudentModel } from "../../database/models/StudentModel";
import { SubmitDTO, ValidationDTO } from "../../../applications/dto/AssignmentDTO ";
import { SubmissionResult } from "../../../domain/UseCaseInterface/Assignment/IGetAssignmentSubmissions";



export class AssignmentMongo extends BaseRepository<AssignmentDocument> implements IAssignmentRepository {
  constructor() {
    super(AssignmentModel);
  }

  async createAssignment(entity: AssignmentEntity): Promise<AssignmentEntity> {
    const doc = await AssignmentModel.create({
      Assignment_Title: entity.Assignment_Title,
      description: entity.description,
      subject: entity.subject,
      classId: new Types.ObjectId(entity.classId),
      Assignment_date: entity.Assignment_date,
      Assignment_Due_Date: entity.Assignment_Due_Date,
      attachments: entity.attachments.map(a => ({
        url: a.url,
        fileName: a.filename,
        uploadedAt: a.uploadedAt,
      })),
      maxMarks: entity.maxMarks,
      teacherId: new Types.ObjectId(entity.teacherId),
    });

    return new AssignmentEntity(
      doc.id,
      doc.Assignment_Title,
      doc.description,
      doc.subject,
      doc.classId.toString(),
      doc.Assignment_date,
      doc.Assignment_Due_Date,
      doc.attachments.map(a => ({
        url: a.url,
        filename: a.fileName,
        uploadedAt: a.uploadedAt,
      })),
      doc.maxMarks,
      doc.teacherId.toString()
    );
  }

  async findByIdEntity(id: string): Promise<AssignmentEntity | null> {
    const doc = await AssignmentModel.findById(id);
    if (!doc) return null;

    return new AssignmentEntity(
      doc.id,
      doc.Assignment_Title,
      doc.description,
      doc.subject,
      doc.classId.toString(),
      doc.Assignment_date,
      doc.Assignment_Due_Date,
      doc.attachments.map(a => ({
        url: a.url,
        filename: a.fileName,
        uploadedAt: a.uploadedAt,
      })),
      doc.maxMarks,
      doc.teacherId.toString()
    );
  }

  async findTeacherSubjects(teacherId: string): Promise<string[]> {
    const teacher = await TeacherModel.findById(teacherId);
    return teacher?.subjects.map(s => s.name) || [];
  }

  async findTimetable(classId: string, teacherId: string, subject: string): Promise<boolean> {
    const timetable = await TimetableModel.findOne({
      classId,
      "days.periods.teacherId": teacherId,
      "days.periods.subject": subject,
    });
    return !!timetable;
  }



  async getTeacherTimeTableinfo(teacherId: string): Promise<{ timetable: TeacherTimetableInfo[], leaveBalance: { sickLeave: number, casualLeave: number }, teacherProfile: { name: string, image?: string } }> {

    const timetable = await TimetableModel.find({ "days.periods.teacherId": teacherId })

      .populate({ path: "classId", select: "className division" })
      .lean();
    console.log(timetable, "timetable")

    const classesMap: Record<
      string,
      { className?: string; division?: string; divisions: string[]; subjects: Set<string> }
    > = {};

    timetable.forEach(tt => {
      const classId = tt.classId?._id?.toString() || tt.classId.toString();

      if (!classesMap[classId]) {
        classesMap[classId] = {
          className: (tt.classId as any)?.className || "Unknown",
          division: (tt.classId as any)?.division || "N/A",

          divisions: [],
          subjects: new Set(),
        };
      }

      tt.days.forEach((day: any) => {
        day.periods.forEach((period: any) => {
          if (period.teacherId.toString() === teacherId) {
            classesMap[classId].subjects.add(period.subject);

            if (!classesMap[classId].divisions.includes(tt.division)) {
              classesMap[classId].divisions.push(tt.division);
            }
          }
        });
      });
    });


    const teacher = await TeacherModel.findById(teacherId).lean();
    const leaveBalance = teacher?.leaveBalance || { sickLeave: 5, casualLeave: 5 };


    return {
      timetable: Object.entries(classesMap).map(([classId, val]) => ({
        classId,
        className: val.className,
        division: val.division,
        divisions: val.divisions,
        subjects: Array.from(val.subjects),
      })),
      leaveBalance,
      teacherProfile: {
        name: teacher?.name || "Teacher",
        image: teacher?.documents?.[0]?.url || ""
      }
    };
  }

  async updateAssignmentDTO(id: string, update: Partial<AssignmentDTO>): Promise<AssignmentEntity | null> {

    if (update.classId && typeof update.classId === "string") {
      if (!Types.ObjectId.isValid(update.classId)) {
        throw new Error("Invalid classId for MongoDB ObjectId");
      }
      update.classId = new Types.ObjectId(update.classId) as any;
    }


    if (update.teacherId && typeof update.teacherId === "string") {
      if (!Types.ObjectId.isValid(update.teacherId)) {
        throw new Error("Invalid teacherId for MongoDB ObjectId");
      }
      update.teacherId = new Types.ObjectId(update.teacherId) as any;
    }


    const doc = await AssignmentModel.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!doc) return null;

    return new AssignmentEntity(
      doc.id,
      doc.Assignment_Title,
      doc.description,
      doc.subject,
      doc.classId.toString(),
      doc.Assignment_date,
      doc.Assignment_Due_Date,
      doc.attachments.map(a => ({
        url: a.url,
        filename: a.fileName,
        uploadedAt: a.uploadedAt,
      })),
      doc.maxMarks,
      doc.teacherId.toString(),
      (doc as any).className,
      (doc as any).division
    );
  }



  async getAssignmentsByTeacher(teacherId: string): Promise<AssignmentEntity[]> {
    const docs = await AssignmentModel.find({ teacherId })
      .populate({ path: "classId", select: "className division" })
      .exec();

    return docs.map(doc => {
      const classObj = doc.classId as any;

      return new AssignmentEntity(
        doc.id.toString(),
        doc.Assignment_Title,
        doc.description,
        doc.subject,
        classObj._id.toString(),
        doc.Assignment_date,
        doc.Assignment_Due_Date,
        doc.attachments.map(a => ({
          url: a.url,
          filename: a.fileName,
          uploadedAt: a.uploadedAt
        })),
        doc.maxMarks,
        doc.teacherId.toString(),
        classObj.className,
        classObj.division
      );
    });
  }


  async getAssignmetEachStudent(studentId: string): Promise<AssignmentEntity[]> {
    const student = await StudentModel.findById(studentId)
      .populate("classId", "className division")
      .lean();

    if (!student || !student.classId) {
      throw new Error("StudentId does not exist or has no classId");
    }

    const classId = (student.classId as any)._id.toString();


    const docs = await AssignmentModel.find({
      classId: new mongoose.Types.ObjectId(classId),
    }).populate("classId", "className division");

    return docs.map((doc) => {
      const classObj = doc.classId as any;
      return new AssignmentEntity(
        doc.id.toString(),
        doc.Assignment_Title,
        doc.description,
        doc.subject,
        classObj._id.toString(),
        doc.Assignment_date,
        doc.Assignment_Due_Date,
        doc.attachments.map((a) => ({
          url: a.url,
          filename: a.fileName,
          uploadedAt: a.uploadedAt,
        })),
        doc.maxMarks,
        doc.teacherId.toString(),
        classObj.className,
        classObj.division,
        doc.assignmentSubmitFile?.filter(sub => sub.studentId?.toString() === studentId).map(sub => ({
          studentId: sub.studentId?.toString(),
          url: sub.url,
          fileName: sub.fileName,
          uploadedAt: sub.uploadedAt,
          studentDescription: sub.studentDescription,
          grade: sub.grade,
          feedback: sub.feedback,
          badge: sub.badge,
          status: sub.status
        }))
      );
    });
  }

  async assignmentsubmit(
    assignmentId: string,
    studentId: string,
    fileUrl: string,
    fileName: string,
    studentDescription?: string
  ): Promise<SubmitDTO[]> {
    const assignment = await AssignmentModel.findById(assignmentId);
    if (!assignment) {
      throw new Error("Assignment Id does not exist");
    }

    if (!studentId) {
      throw new Error("Student Id is required");
    }

    // Find existing submission
    const existingSubmission = assignment.assignmentSubmitFile.find(sub =>
      sub.studentId?.toString() === studentId
    );

    if (existingSubmission) {
      // Update existing submission
      existingSubmission.url = fileUrl;
      existingSubmission.fileName = fileName;
      existingSubmission.uploadedAt = new Date();
      existingSubmission.studentDescription = studentDescription || "";
      existingSubmission.status = 'Submitted';
    } else {
      // Push new submission
      assignment.assignmentSubmitFile.push({
        studentId: new mongoose.Types.ObjectId(studentId),
        url: fileUrl,
        fileName,
        uploadedAt: new Date(),
        studentDescription: studentDescription || "",
        status: 'Submitted'
      });
    }

    await assignment.save();


    return assignment.assignmentSubmitFile.map(sub => ({
      assignmentId: assignment.id,
      studentId: sub.studentId ? sub.studentId.toString() : "unknown",
      fileUrl: sub.url,
      fileName: sub.fileName,
      uploadedAt: sub.uploadedAt,
      studentDescription: sub.studentDescription,
    }));
  }

  async validateAssignment(data: ValidationDTO): Promise<AssignmentEntity | null> {
    const assignment = await AssignmentModel.findById(data.assignmentId);
    if (!assignment) return null;

    const submission = assignment.assignmentSubmitFile.find(sub =>
      sub.studentId?.toString() === data.studentId
    );

    if (submission) {
      submission.grade = data.grade;
      submission.feedback = data.feedback;
      submission.badge = data.badge;
      submission.status = data.status || 'Graded';
    } else {

      assignment.assignmentSubmitFile.push({
        studentId: new mongoose.Types.ObjectId(data.studentId),
        url: "",
        fileName: "",
        uploadedAt: new Date(),
        studentDescription: "",
        grade: data.grade,
        feedback: data.feedback,
        badge: data.badge,
        status: data.status || 'Graded'
      });
    }

    await assignment.save();
    return this.findByIdEntity(data.assignmentId);
  }

  async getAssignmentSubmissions(assignmentId: string): Promise<SubmissionResult[]> {
    const assignment = await AssignmentModel.findById(assignmentId);
    if (!assignment) return [];

    // Fetch all students in the class
    const students = await StudentModel.find({ classId: assignment.classId }).lean();

    const results: SubmissionResult[] = students.map((student: any) => {
      const sub = assignment.assignmentSubmitFile.find(s => s.studentId?.toString() === student._id.toString());
      return {
        studentId: student._id.toString(),
        studentName: student.fullName,
        admissionNumber: student.studentId,
        submitted: !!sub,
        submissionDate: sub?.uploadedAt,
        fileUrl: sub?.url,
        fileName: sub?.fileName,
        grade: sub?.grade,
        feedback: sub?.feedback,
        badge: sub?.badge,
        status: sub?.status || (sub ? 'Submitted' : 'Pending')
      };
    });

    return results;
  }
}


