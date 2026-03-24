import { ParentSignUpEntity } from "../../../domain/entities/ParentSignupEntity";
import { IParentRepositorySign } from '../../interface/RepositoryInterface/Auth/IParentRepository'
import bcrypt from "bcrypt";
import { IParentSignupUseCase } from "../../interface/UseCaseInterface/IParentSignupUseCase";
import { ParentLoginDTO } from "../../dto/ParentLoginDTO";

export class SignupParentUseCase implements IParentSignupUseCase {
  constructor(private repo: IParentRepositorySign) {}

  async execute(dto: ParentLoginDTO) {
    const { studentId, email, password } = dto;
    const student = await this.repo.findStudentById(studentId);
    if (!student) throw new Error("Student not found");

    const existed = await this.repo.findByEmail(email);
    if (existed) throw new Error("Email already exists");

    const hashPassword = await bcrypt.hash(password, 10);
    const parent = new ParentSignUpEntity("", email, hashPassword, studentId);

    const saved = await this.repo.create(parent);
    await this.repo.linkParenttoStudent(studentId, saved.id);

    return saved;
  }
}
