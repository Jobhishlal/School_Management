import { SendEMail } from "../../../infrastructure/providers/EmailService";
import { genaratePassword } from "../../../shared/constants/utils/TempPassGenarator";
import { Teeacher } from "../../../domain/entities/Teacher";
import { ITeacherCreate } from "../../../domain/repositories/TeacherCreate";
import { CreateTeacherDTO, TeacherResponseDTO } from '../../dto/TeacherDto';
import bcrypt from "bcrypt";

export class TeacherCreateUseCase {
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
      hashed
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
    }));
  }
}
