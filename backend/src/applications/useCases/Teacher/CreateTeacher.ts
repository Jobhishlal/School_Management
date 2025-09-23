import { SendEMail } from "../../../infrastructure/providers/EmailService";
import { genaratePassword } from "../../../shared/constants/utils/TempPassGenarator";
import { Teeacher } from "../../../domain/entities/Teacher";
import { ITeacherCreate } from "../../../domain/repositories/TeacherCreate";
import { CreateTeacherDTO, TeacherResponseDTO } from '../../dto/TeacherDto';
import {generateSubjectCode} from '../../../shared/constants/utils/SubejctCode'
import bcrypt from "bcrypt";

export class TeacherCreateUseCase implements TeacherCreateUseCase {
  constructor(private teacherRepo: ITeacherCreate) {}

  async execute(dto: CreateTeacherDTO): Promise<TeacherResponseDTO> {
    const existed = await this.teacherRepo.findByEmail(dto.email);
    if (existed) {
      throw new Error("This Email already exists");
    }

    const existedphone = await this.teacherRepo.findByPhone(dto.phone);
    if (existedphone) {
      throw new Error("This Phone number already exists");
    }

    const rawPassword = dto.Password?.trim() || genaratePassword();
    const hashed = await bcrypt.hash(rawPassword, 10);


    let subjectsArray: { name: string; code?: string }[] = [];
  if (dto.subjects) {
    if (typeof dto.subjects === "string") {
      try {
        subjectsArray = JSON.parse(dto.subjects);
        if (!Array.isArray(subjectsArray)) subjectsArray = [];
      } catch (err) {
        subjectsArray = [];
      }
    } else if (Array.isArray(dto.subjects)) {
      subjectsArray = dto.subjects;
    }
  }

  
   const subjectsWithCodes = subjectsArray.map(sub => ({
  name: sub.name,
  code: sub.code || generateSubjectCode(sub.name),
}));


    const teacher = new Teeacher(
      "",
      dto.name,
      dto.email,
      dto.phone,
      dto.gender,
      dto.role || "Teacher",
      new Date(),
      new Date(),
      dto.blocked ?? false,
      hashed,
      (dto.documents ?? []).map(doc => ({
    url: doc.url,
    filename: doc.filename,
    uploadedAt: doc.uploadedAt ?? new Date(), 
  })),
  subjectsWithCodes,
  dto.department
    );

    const saved = await this.teacherRepo.create(teacher);

    await SendEMail(
      dto.email,
      "YOUR TEACHER CREDENTIALS",
      `HELLO ${dto.name}\n\nYOUR PASSWORD: ${rawPassword}\nPLEASE LOGIN AND CHANGE IMMEDIATELY`
    );


    return {
      id: saved.id,
      name: saved.name,
      email: saved.email,
      phone: saved.phone,
      gender: saved.gender,
      role: saved.role,
      blocked: saved.blocked,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
     documents: saved.documents ?? [],
      Subject:saved.subjects??[],
      department:saved.department
      
    };
  }

  async getall(): Promise<TeacherResponseDTO[]> {
    const teachers = await this.teacherRepo.finByAll();
    return teachers.map(saved => ({
      id: saved.id,
      name: saved.name,
      email: saved.email,
      phone: saved.phone,
      gender: saved.gender,
      role: saved.role,
      blocked: saved.blocked,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
      documents: saved.documents ?? [],
      Subject:saved.subjects??[],
      department:saved.department
      
    }));
  }
}
