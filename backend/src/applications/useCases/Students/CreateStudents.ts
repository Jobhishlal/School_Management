import { Students } from "../../../domain/entities/Students";
import { IStudentAddUsecase } from "../../interface/UseCaseInterface/IAddStudents";
import { IParentRepository } from "../../interface/RepositoryInterface/IParentsRepository";
import { StudentDetails } from "../../interface/RepositoryInterface/Admin/IStudnetRepository";
import { IEmailServiceShare } from "../../interface/UseCaseInterface/StudentCreate/IEmailSendUsecase";
import { IGenarateTempPassword } from "../../interface/UseCaseInterface/StudentCreate/GenaratePassword";
import { IStudentIdGenarate } from "../../interface/UseCaseInterface/StudentCreate/GenarateStudentId";

export class StudentAddUseCase implements IStudentAddUsecase {
  constructor(
    private readonly studentRepo: StudentDetails,
    private readonly parentRepo: IParentRepository,
    private readonly studentIdgenarate: IStudentIdGenarate,
    private readonly tempasswordgenarate: IGenarateTempPassword,
    private readonly emailserviceshare: IEmailServiceShare
  ) { }
  async execute(student: Students): Promise<{ student: Students; tempPassword: string; }> {
    const studentId = this.studentIdgenarate.execute()
    const { plain: tempPassword, hashed } = await this.tempasswordgenarate.execute()
    student.studentId = studentId;
    student.Password = hashed;
    const created = await this.studentRepo.create(student)
    const parent = await this.parentRepo.getById(created.parentId)
    if (parent?.email) {
      console.log("parent details", parent)
      await this.emailserviceshare.execute(
        parent.name ?? "Parent",
        parent.email,
        student.fullName,
        studentId,
        tempPassword
      )
    }

    return { student: created, tempPassword }

  }

}
