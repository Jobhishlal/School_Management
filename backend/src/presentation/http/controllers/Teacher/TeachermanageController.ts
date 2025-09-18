import { TeacherCreateUseCase } from "../../../../applications/useCases/Teacher/CreateTeacher";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import logger from "../../../../shared/constants/Logger";
import { ITeacherCreatecontroller } from "../../interface/ITeachercontroller";
import { Request, Response } from "express";
import { UpdateTeacher } from "../../../../applications/useCases/Teacher/UpdateTeachers";
import { BlockTeacher } from "../../../../applications/useCases/Teacher/BlockTeacher";


export class TeacherCreateController implements ITeacherCreatecontroller{
    constructor(
        private createteacherUseCase:TeacherCreateUseCase,
        private updateTeacherUseCase:UpdateTeacher ,
        private blockTeacherUseCase:BlockTeacher){}
    
    async createteacher(req: Request, res: Response): Promise<void> {
        try {
            const {name,email,phone,role,blocked,gender,Password}=req.body
            logger.info(JSON.stringify(req.body))
            const result = await this.createteacherUseCase.execute({
                 name,
                 email,
                 phone,
                 role,
                blocked,
                gender,
                Password
                });

            res.status(StatusCodes.OK).json({
                message:"successfully created admin password send to you email",
                teachers:result
            })
        } catch (error:any) {
            logger.info(error)
             if (
          error.message === "email already exised" ||
          error.message === "enter valueable phone number"
        ) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
       } else {
        res
         .status(StatusCodes.INTERNAL_SERVER_ERROR)
         .json({ message: error.message || "Internal Server Error" });
        }
        }
    }
    async getAllTeacher(req: Request, res: Response): Promise<void> {
        try {
            const teacher = await this.createteacherUseCase.getall()
            res.status(StatusCodes.OK).json(teacher)
        } catch (error:any) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:error.message})
        }
    }
    async updateTeacher(req: Request, res: Response): Promise<void> {
        try {
            const {name,email,phone,gender}=req.body;
        const {id}=req.params;
        const update = await this.updateTeacherUseCase.execute(
            id,
            {name,email,phone,gender}
        )

        res.status(StatusCodes.CREATED).json({message:"successfully updated Teachers",teachers:update})
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
        }
        
    }

    async blockTeacher(req: Request, res: Response): Promise<void> {
        try{
             const {blocked}=req.body;
             const {id}=req.params;
             const result = await this.blockTeacherUseCase.execute(id,blocked)
             res.status(StatusCodes.OK).json({
                message:blocked?"Teacher Blocked Successfully":"Teacher UnBlocked Successfully",
                teacher:result})
        }catch(error:any){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({message:"Internal Server Error"})
        }
    }  
}