import { AttendanceModel } from "../../database/models/AttandanceModel";
import { IAttandanceRepository } from "../../../domain/repositories/Attandance/IAttendanceRepository";
import { TakeAttendance } from "../../../applications/dto/Attendance/TakeAttendanceDTO";
import { AttendanceEntity, AttendanceSession } from "../../../domain/entities/AttandanceEntity";
import { ClassModel } from "../../database/models/ClassModel";
import { Types } from "mongoose";
import { Class } from "../../../domain/entities/Class";
import { TodayAttendanceResponse ,TodayAttendanceItemDTO} from "../../../applications/dto/Attendance/TodayAttendanceDTO";
import { StudentModel } from "../../database/models/StudentModel";
import { ParentSignupModel } from "../../database/models/ParentSignupModel";
import { ParentAttendanceDashboardDTO } from "../../../applications/dto/Attendance/ParentAttendanceDashboardDTO";

export class AttendanceMongoRepository implements IAttandanceRepository{
    
 async create(data: TakeAttendance): Promise<AttendanceEntity> {
     const doc = await AttendanceModel.create({
      classId: data.classId,
      teacherId: data.teacherId,
      date: data.date,
      session: data.session,
      attendance: data.attendance,
    });

    if (!doc) {
      throw new Error("Failed to create attendance");
    }

    return new AttendanceEntity(
      doc.classId.toString(),
      doc.teacherId.toString(),
      doc.date,
      doc.session,
      doc.attendance,
      doc.createdAt,
      doc.updatedAt
    );
 }

 async findByDateSession(classId: Types.ObjectId | string, date: Date, session: AttendanceSession): Promise<AttendanceEntity | null> {
     const classObjectId = typeof classId === "string" ? new Types.ObjectId(classId) : classId;

    const existing = await AttendanceModel.findOne({
        classId: classObjectId,
        date: date,
        session: session
    });

    if (!existing) return null;

    return new AttendanceEntity(
        existing.classId.toString(),
        existing.teacherId.toString(),
        existing.date,
        existing.session,
        existing.attendance,
        existing.createdAt,
        existing.updatedAt
    );
 }
async findclassTeacher(teacherId: string): Promise<Class> {
    
    const classDoc = await ClassModel.findOne({ classTeacher: teacherId });

    if (!classDoc) {
        throw new Error("No class assigned to this teacher");
    }

    return new Class(
        classDoc.id.toString(),
        classDoc.className,
        classDoc.division,
        classDoc.rollNumber,
        classDoc.department,
        classDoc.subjects,
        classDoc.classTeacher?.toString()
    );
}


 async getTodayAttendanceByClass(classId: string): Promise<TodayAttendanceItemDTO[]> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

  
    const allStudents = await StudentModel.find({ classId }).select("_id fullName");
    if (!allStudents || allStudents.length === 0) return [];

    const attendanceDocs = await AttendanceModel.find({
      classId: new Types.ObjectId(classId),
      date: { $gte: todayStart, $lte: todayEnd },
    }).populate("attendance.studentId", "fullName");

    const attendanceMap: Record<string, { Morning?: string; Afternoon?: string }> = {};

    attendanceDocs.forEach(doc => {
      doc.attendance.forEach(a => {
        const studentId = (a.studentId as any)._id.toString();
        const status = a.status as "Present" | "Absent";
        if (!attendanceMap[studentId]) attendanceMap[studentId] = {};
        attendanceMap[studentId][doc.session] = status;
      });
    });

    
    return allStudents.map(s => ({
      studentId: s._id.toString(),
      studentName: s.fullName,
      Morning: (attendanceMap[s._id.toString()]?.Morning as any) ?? "Not Marked",
      Afternoon: (attendanceMap[s._id.toString()]?.Afternoon as any) ?? "Not Marked",
    }));
  }
    async findParentWithStudent(parentId: string) {
      const parent = await ParentSignupModel
      .findById(parentId)
      .populate("student", "_id fullName classId");

     if (!parent || !parent.student) {
      throw new Error("Parent or student not found");
     }

    return {
     studentId: parent.student._id.toString(),
    studentName: parent.student.fullName,
    classId: parent.student.classId.toString(),
  };
}
async getParentAttendanceDashboard(
  parentId: string
): Promise<ParentAttendanceDashboardDTO> {

  type AttendanceStatus = "Present" | "Absent" | "Not Marked";

  const parent = await ParentSignupModel
    .findById(parentId)
    .populate("student", "_id fullName photos classId");

  if (!parent || !parent.student) {
    throw new Error("Parent or student not found");
  }

  const studentId = parent.student._id;

  const records = await AttendanceModel.find({
    "attendance.studentId": studentId,
  }).sort({ date: -1 });

  let present = 0;
  let absent = 0;
  let leave = 0;

  const calendar: any[] = [];
  const logs: any[] = [];

  let todayMorning: AttendanceStatus = "Not Marked";
  let todayAfternoon: AttendanceStatus = "Not Marked";

  const today = new Date().toDateString();

  records.forEach(doc => {
    const item = doc.attendance.find(
      a => a.studentId.toString() === studentId.toString()
    );
    if (!item) return;

    // Summary count
    if (item.status === "Present") present++;
    if (item.status === "Absent") absent++;

    // Calendar
    calendar.push({
      date: doc.date.toISOString().split("T")[0],
      status: item.status,
    });

    // Logs
    logs.push({
      date: doc.date.toISOString().split("T")[0],
      session: doc.session,
      status: item.status,
      remark: item.remarks,
    });

    // Today status
    if (doc.date.toDateString() === today) {
      if (doc.session === "Morning") {
        todayMorning = item.status as AttendanceStatus;
      }
      if (doc.session === "Afternoon") {
        todayAfternoon = item.status as AttendanceStatus;
      }
    }
  });

  const total = present + absent + leave;
  const percentage = total ? Math.round((present / total) * 100) : 0;

  return {
    student: {
      id: studentId.toString(),
      name: parent.student.fullName,
      photo: parent.student.photos?.[0]?.url,
      classId: parent.student.classId,
    },
    summary: {
      totalClasses: total,
      present,
      absent,
      leave,
      percentage,
    },
    today: {
      Morning: todayMorning,
      Afternoon: todayAfternoon,
    },
    calendar,
    logs,
  };
}



}