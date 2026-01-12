import { AttendanceModel } from "../../database/models/AttandanceModel";
import { IAttandanceRepository } from "../../../domain/repositories/Attandance/IAttendanceRepository";
import { TakeAttendance } from "../../../applications/dto/Attendance/TakeAttendanceDTO";
import { AttendanceEntity, AttendanceSession } from "../../../domain/entities/AttandanceEntity";
import { ClassModel } from "../../database/models/ClassModel";
import { Types } from "mongoose";
import { Class } from "../../../domain/entities/Class";
import { TodayAttendanceResponse, TodayAttendanceItemDTO } from "../../../applications/dto/Attendance/TodayAttendanceDTO";
import { StudentModel } from "../../database/models/StudentModel";
import { ParentSignupModel } from "../../database/models/ParentSignupModel";
import { ParentAttendanceDashboardDTO } from "../../../applications/dto/Attendance/ParentAttendanceDashboardDTO";
import { ParentAttendanceHistory } from "../../../applications/dto/Attendance/ParentAttendanceHistory";
import { AttendanceHistoryItem } from "../../../applications/dto/Attendance/ParentAttendanceHistory";

export class AttendanceMongoRepository implements IAttandanceRepository {

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


  async getTodayAttendanceByClass(classId: string, status?: string): Promise<TodayAttendanceItemDTO[]> {
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


    let result = allStudents.map(s => ({
      studentId: s._id.toString(),
      studentName: s.fullName,
      Morning: (attendanceMap[s._id.toString()]?.Morning as any) ?? "Not Marked",
      Afternoon: (attendanceMap[s._id.toString()]?.Afternoon as any) ?? "Not Marked",
    }));

    if (status) {
      result = result.filter(r => r.Morning === status || r.Afternoon === status);
    }

    return result;
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

    type AttendanceStatus = "Present" | "Absent" | "Leave";

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

    let todayMorning: AttendanceStatus = "Leave";
    let todayAfternoon: AttendanceStatus = "Leave";

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




  async getAttendanceByDateRange(classId: string, startDate: Date, endDate: Date): Promise<any[]> {
    const records = await AttendanceModel.find({
      classId: new Types.ObjectId(classId),
      date: { $gte: startDate, $lte: endDate },
    }).populate("attendance.studentId", "fullName rollNumber");

    return records.map(doc => ({
      date: doc.date,
      session: doc.session,
      attendance: doc.attendance.map(a => ({
        studentId: (a.studentId as any)._id,
        studentName: (a.studentId as any).fullName,
        status: a.status,
        remarks: a.remarks
      })),
      presentCount: doc.attendance.filter(a => a.status === 'Present').length,
      absentCount: doc.attendance.filter(a => a.status === 'Absent').length
    }));
  }

  async getStudentAttendanceHistory(studentId: string, month: number, year: number): Promise<any> {
    if (!Types.ObjectId.isValid(studentId)) {
      throw new Error("Invalid Student ID");
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const records = await AttendanceModel.find({
      "attendance.studentId": new Types.ObjectId(studentId),
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    const history = records.map(doc => {
      const entry = doc.attendance.find(a => a.studentId.toString() === studentId);
      return {
        date: doc.date,
        session: doc.session,
        status: entry?.status || 'Not Marked',
        remarks: entry?.remarks
      };
    });

    const present = history.filter(h => h.status === 'Present').length;
    const absent = history.filter(h => h.status === 'Absent').length;
    const total = history.length;
    const percentage = total > 0 ? (present / total) * 100 : 0;

    return {
      history,
      summary: {
        total,
        present,
        absent,
        percentage
      }
    };
  }

  async updateStudentAttendance(studentId: string, date: Date, session: string, status: string): Promise<boolean> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const result = await AttendanceModel.updateOne(
      {
        date: { $gte: startDate, $lte: endDate },
        session: session,
        "attendance.studentId": new Types.ObjectId(studentId)
      },
      {
        $set: { "attendance.$.status": status }
      }
    );

    return result.modifiedCount > 0;
  }



  async calculateClassAttendancePercentage(classId: string): Promise<{ percentage: number, trend: number }> {
    if (!classId) return { percentage: 0, trend: 0 };

    const result = await AttendanceModel.aggregate([
      { $match: { classId: new Types.ObjectId(classId) } },
      { $unwind: "$attendance" },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          present: {
            $sum: {
              $cond: [{ $eq: ["$attendance.status", "Present"] }, 1, 0]
            }
          }
        }
      }
    ]);

    const percentage = result.length > 0 && result[0].total > 0
      ? Math.round((result[0].present / result[0].total) * 100)
      : 0;

    // Mock trend for now
    const trend = 2; // +2%

    return { percentage, trend };
  }

  async getAttendancePercentages(studentIds: string[]): Promise<Record<string, number>> {
    const objectIds = studentIds.map(id => new Types.ObjectId(id));

    const result = await AttendanceModel.aggregate([
      { $unwind: "$attendance" },
      { $match: { "attendance.studentId": { $in: objectIds } } },
      {
        $group: {
          _id: "$attendance.studentId",
          total: { $sum: 1 },
          present: {
            $sum: {
              $cond: [{ $eq: ["$attendance.status", "Present"] }, 1, 0]
            }
          }
        }
      }
    ]);

    const percentages: Record<string, number> = {};
    result.forEach(r => {
      percentages[r._id.toString()] = r.total > 0 ? Math.round((r.present / r.total) * 100) : 0;
    });

    return percentages;
  }

  async getParentAttendanceByDateRange(parentId: string, startDate: Date, endDate: Date): Promise<ParentAttendanceHistory> {
    const parent = await ParentSignupModel.findById(parentId)
      .populate("student", "_id fullName photos classId")

    if (!parent || !parent.student) {
      throw new Error("student does not found")
    }
    const studentId = parent.student._id;
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const records = await AttendanceModel.find({
      "attendance.studentId": new Types.ObjectId(studentId),
      date: { $gte: start, $lte: end }
    }).sort({ date: 1 });



    const history: AttendanceHistoryItem[] = records.map(doc => {
      const item = doc.attendance.find(
        a => a.studentId.toString() === studentId.toString()
      );

      return {
        date: doc.date.toISOString().split("T")[0],
        session: doc.session as "Morning" | "Afternoon",
        status: (item?.status as any) ?? "Not Marked",
        remarks: item?.remarks ?? ""
      };
    });

    const present = history.filter(h => h.status === "Present").length;
    const absent = history.filter(h => h.status === "Absent").length;
    const total = history.length;
    const percentage = total ? Math.round((present / total) * 100) : 0;

    return {
      student: {
        id: studentId.toString(),
        name: parent.student.fullName,
        classId: parent.student.classId.toString(),
        photo: parent.student.photos?.[0]?.url
      },
      summary: {
        totalClasses: total,
        present,
        absent,
        percentage
      },
      logs: history
    };

  }

  async getStudentOwnAttendanceDashboard(studentId: string): Promise<ParentAttendanceDashboardDTO> {
    type AttendanceStatus = "Present" | "Absent" | "Leave";

    const student = await StudentModel.findById(studentId);
    if (!student) throw new Error("Student not found");

    const records = await AttendanceModel.find({
      "attendance.studentId": new Types.ObjectId(studentId),
    }).sort({ date: -1 });

    let present = 0;
    let absent = 0;
    let leave = 0;

    const calendar: any[] = [];
    const logs: any[] = [];

    let todayMorning: AttendanceStatus | "Not Marked" = "Not Marked";
    let todayAfternoon: AttendanceStatus | "Not Marked" = "Not Marked";

    const todayString = new Date().toDateString();

    records.forEach(doc => {

      const item = doc.attendance.find(
        a => a.studentId.toString() === studentId.toString()
      );
      if (!item) return;

      if (item.status === "Present") present++;
      if (item.status === "Absent") absent++;
      if (item.status === "Leave") leave++;

      calendar.push({
        date: doc.date.toISOString().split("T")[0],
        status: item.status,
      });

      logs.push({
        date: doc.date.toISOString().split("T")[0],
        session: doc.session,
        status: item.status,
        remark: item.remarks,
      });


      if (doc.date.toDateString() === todayString) {
        if (doc.session === "Morning") todayMorning = item.status as AttendanceStatus;
        if (doc.session === "Afternoon") todayAfternoon = item.status as AttendanceStatus;
      }
    });

    const total = present + absent + leave;
    const percentage = total ? Math.round((present / total) * 100) : 0;

    return {
      student: {
        id: studentId.toString(),
        name: student.fullName,
        photo: student.photos?.[0]?.url,
        classId: student.classId.toString(),
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

  async getStudentOwnAttendanceByDateRange(studentId: string, startDate: Date, endDate: Date): Promise<ParentAttendanceHistory> {
    const student = await StudentModel.findById(studentId);
    if (!student) throw new Error("Student not found");

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const records = await AttendanceModel.find({
      "attendance.studentId": new Types.ObjectId(studentId),
      date: { $gte: start, $lte: end }
    }).sort({ date: 1 });

    const history: AttendanceHistoryItem[] = records.map(doc => {
      const item = doc.attendance.find(
        a => a.studentId.toString() === studentId.toString()
      );

      return {
        date: doc.date.toISOString().split("T")[0],
        session: doc.session as "Morning" | "Afternoon",
        status: (item?.status as any) ?? "Not Marked",
        remarks: item?.remarks ?? ""
      };
    });

    const present = history.filter(h => h.status === "Present").length;
    const absent = history.filter(h => h.status === "Absent").length;

    const total = history.length;
    const percentage = total ? Math.round((present / total) * 100) : 0;

    return {
      student: {
        id: studentId.toString(),
        name: student.fullName,
        classId: student.classId.toString(),
        photo: student.photos?.[0]?.url
      },
      summary: {
        totalClasses: total,
        present,
        absent,
        percentage
      },
      logs: history
    };
  }
}
