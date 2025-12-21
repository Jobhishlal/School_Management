import { AttendanceModel } from "../../database/models/AttandanceModel";
import { IAttandanceRepository } from "../../../domain/repositories/Attandance/IAttendanceRepository";
import { TakeAttendance } from "../../../applications/dto/Attendance/TakeAttendanceDTO";
import { AttendanceEntity, AttendanceSession } from "../../../domain/entities/AttandanceEntity";
import { ClassModel } from "../../database/models/ClassModel";
import { Types } from "mongoose";
import { Class } from "../../../domain/entities/Class";

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
}