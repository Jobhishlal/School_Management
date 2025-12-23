import { ExamMarkResponseDTO } from "../../../applications/dto/Exam/ExamMarkCreateDTO";
import { ExamMarkEntity } from "../../entities/Exam/ExamMarkEntity";
import { CreateExamMarkDTO } from "../../../applications/dto/Exam/CreateExamMarkDTO";
import { UpdateExamMarkDTO } from "../../../applications/dto/Exam/UpdateExamMarkDTO";
export interface IExamMarkRepository{
    create(data:CreateExamMarkDTO):Promise<ExamMarkEntity>
    update(id: string, data: UpdateExamMarkDTO): Promise<ExamMarkEntity | null>;
      findByExamAndStudent(examId: string, studentId: string): Promise<ExamMarkEntity | null>;
      findClassResults(classId: string, teacherId: string ,examId: string):Promise<ExamMarkEntity[]>
       findMarksForStudent(studentId: string, examIds: string[]): Promise<ExamMarkEntity[]>;
       
     
}