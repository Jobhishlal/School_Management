import { ITeacherCreate } from "../../domain/repositories/TeacherCreate";
import { TeacherModel } from "../database/models/Teachers";
import { Teeacher } from "../../domain/entities/Teacher";
import logger from "../../shared/constants/Logger";

export class MongoTeacher implements ITeacherCreate {
  async create(teacher: Teeacher): Promise<Teeacher> {
    const teachers = await TeacherModel.create({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      Password: teacher.Password,
      role: teacher.role,
      gender: teacher.gender,
      documents: teacher.documents ?? [],
      subjects: teacher.subjects ?? [],
      department: teacher.department

    })

    return new Teeacher(
      teacher.id.toString(),
      teacher.name,
      teacher.email,
      teacher.phone,
      teacher.gender,
      teacher.role,
      teacher.createdAt,
      teacher.updatedAt,
      teacher.blocked,
      teacher.Password,
      teacher.documents,
      teacher.subjects,
      teacher.department,
      teacher.leaveBalance
    )
  }

  async findByEmail(email: string): Promise<Teeacher | null> {
    const normalizedEmail = email.trim().toLowerCase();
    const doc = await TeacherModel.findOne({ email: normalizedEmail });
    if (!doc) return null;

    if (!doc._id || !doc.Password) {
      logger.error("Teacher document missing required fields", doc);
      return null;
    }

    return new Teeacher(
      doc._id.toString(),
      doc.name,
      doc.email,
      doc.phone,
      doc.gender,
      doc.role,
      doc.createdAt,
      doc.updatedAt,
      doc.blocked,
      doc.Password,
      doc.documents,
      doc.subjects,
      doc.department,
      doc.leaveBalance
    );
  }




  async findByPhone(phone: string): Promise<Teeacher | null> {
    const teacher = await TeacherModel.findOne({ phone })
    if (!teacher) return null
    return new Teeacher(
      teacher.id.toString(),
      teacher.name,
      teacher.email,
      teacher.phone,
      teacher.gender,
      teacher.role,
      teacher.createdAt,
      teacher.updatedAt,
      teacher.blocked,
      teacher.Password,
      teacher.documents,
      teacher.subjects,
      teacher.department,
      teacher.leaveBalance


    )
  }
  async findAll(): Promise<Teeacher[]> { // Corrected name
    const teachers = await TeacherModel.find();

    return teachers.map((teacher) => {
      return new Teeacher(
        teacher.id.toString(),
        teacher.name,
        teacher.email,
        teacher.phone,
        teacher.gender,
        teacher.role,
        teacher.createdAt,
        teacher.updatedAt,
        teacher.blocked,
        teacher.Password,
        teacher.documents,
        teacher.subjects,
        teacher.department,
        teacher.leaveBalance
      );
    });
  }

  async update(id: string, update: Partial<Teeacher>): Promise<Teeacher | null> {
    const teacher = await TeacherModel.findByIdAndUpdate(id, update, { new: true })
    if (!teacher) return null
    return new Teeacher(
      teacher.id.toString(),
      teacher.name,
      teacher.email,
      teacher.phone,
      teacher.gender,
      teacher.role,
      teacher.createdAt,
      teacher.updatedAt,
      teacher.blocked,
      teacher.Password,
      teacher.documents,
      teacher.subjects,
      teacher.department,
      teacher.leaveBalance
    )
  }
  async findById(id: string): Promise<Teeacher | null> {
    const teacher = await TeacherModel.findById(id)
    if (!teacher) return null
    return new Teeacher(
      teacher.id.toString(),
      teacher.name,
      teacher.email,
      teacher.phone,
      teacher.gender,
      teacher.role,
      teacher.createdAt,
      teacher.updatedAt,
      teacher.blocked,
      teacher.Password,
      teacher.documents,
      teacher.subjects,
      teacher.department,
      teacher.leaveBalance
    )
  }
  async addDocument(id: string, document: { url: string; filename: string; }): Promise<Teeacher | null> {
    const updated = await TeacherModel.findByIdAndUpdate(id,
      { $push: { documents: { ...document, uploadedAt: new Date() } } },
      { new: true })
    if (!updated) return null
    return new Teeacher(
      updated._id.toString(),
      updated.name,
      updated.email,
      updated.phone,
      updated.gender,
      updated.role,
      updated.createdAt,
      updated.updatedAt,
      updated.blocked,
      updated.Password,
      updated.documents,
      updated.subjects,
      updated.department,
      updated.leaveBalance
    );
  }

  async addSubjects(
    id: string,
    subjects: { name: string; code: string }[]
  ): Promise<Teeacher | null> {
    const updated = await TeacherModel.findByIdAndUpdate(
      id,
      { $push: { subjects: { $each: subjects } } },
      { new: true }
    );

    if (!updated) return null;

    return new Teeacher(
      updated._id.toString(),
      updated.name,
      updated.email,
      updated.phone,
      updated.gender,
      updated.role,
      updated.createdAt,
      updated.updatedAt,
      updated.blocked,
      updated.Password,
      updated.documents,
      updated.subjects,
      updated.department,
      updated.leaveBalance
    );
  }



}