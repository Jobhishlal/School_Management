import { Institute } from "../entities/Institute";

export interface IInstituteUsecase{
    execute(institute:Institute):Promise<Institute>
}