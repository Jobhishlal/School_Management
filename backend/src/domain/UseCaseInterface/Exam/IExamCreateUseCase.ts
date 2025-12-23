import { CreateExamDTO } from "../../../applications/dto/Exam/CreateExamDTO";
import { ExamEntity } from "../../entities/Exam/ExamEntity";


export interface IExamCreateRepository{
    execute(data:CreateExamDTO):Promise<ExamEntity>
}