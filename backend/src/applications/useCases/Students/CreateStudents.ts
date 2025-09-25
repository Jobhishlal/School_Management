import { Students } from "../../../domain/entities/Students";
import { IStudentAddUsecase } from "../../../domain/UseCaseInterface/IAddStudents";
import { IParentRepository } from "../../../domain/repositories/IParentsRepository";
import { StudentDetails } from "../../../domain/repositories/Admin/IStudnetRepository";
import { GenaratesStudent_id } from "../../../infrastructure/security/Student_idGen";
import { genaratePassword, hashedPassword } from "../../../shared/constants/utils/TempPassGenarator";
import { sendWatsApp } from "../../../infrastructure/providers/WhatsAppService";
import { SendEMail } from "../../../infrastructure/providers/EmailService";
import { validateStudent } from "../../validators/StudentValidate";
export class StudentAddUseCase implements IStudentAddUsecase {
  constructor(
    private readonly studentRepo: StudentDetails,
    private readonly parentRepo: IParentRepository   
  ) {}


   

  

 async execute(student: Students): Promise<{ student: Students; tempPassword: string }> {
  validateStudent(student)
 
    const student_id = GenaratesStudent_id();
    const tempPassword = genaratePassword();
    const hashpassword = await hashedPassword(tempPassword);

    student.studentId = student_id;
    student.Password = hashpassword;

    const created = await this.studentRepo.create(student);


    const parent = await this.parentRepo.getById(created.parentId);

if (parent && parent.whatsappNumber) {
  const formattedNumber = parent.whatsappNumber.startsWith("+91")
    ? parent.whatsappNumber
    : `+91${parent.whatsappNumber}`;

  const message = `Hello ${parent.name},\n\nYour child ${created.fullName} has been registered successfully.\n\n🆔 Student ID: ${student_id}\n🔑 Password: ${tempPassword}\n\nPlease keep this information safe.`;

  await sendWatsApp(formattedNumber, message);
}


 if (parent && parent.email) {
      const emailMessage = `Hello ${parent.name},\n\nYour child ${created.fullName} has been registered successfully.\n\n🆔 Student ID: ${student_id}\n🔑 Password: ${tempPassword}\n\nPlease keep this information safe.`;

      await SendEMail(parent.email, "Student Registration Successful", emailMessage);
    }


    
    return { student: created, tempPassword };
}

}
