import { CreateExamDTO } from "../../../dto/Exam/CreateExamDTO";
import { ExamEntity } from "../../../../domain/entities/Exam/ExamEntity";


export interface IExamCreateRepository{
    execute(data:CreateExamDTO):Promise<ExamEntity>
}