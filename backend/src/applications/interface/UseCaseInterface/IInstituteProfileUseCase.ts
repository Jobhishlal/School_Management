import { Institute } from "../../../domain/entities/Institute";

export interface IInstituteUsecase{
    execute(institute:Institute):Promise<Institute>
}