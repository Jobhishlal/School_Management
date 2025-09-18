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
      const {
        name,
        email,
        phone,
        role,
        blocked,
        gender,
        Password,
        department,
      } = req.body;

    
     let subjectsArray: { name: string; code: string }[] = [];
if (req.body.subjects) {
  if (typeof req.body.subjects === "string") {
    try {
      subjectsArray = JSON.parse(req.body.subjects);
    } catch {
      subjectsArray = [];
    }
  } else if (Array.isArray(req.body.subjects)) {
    subjectsArray = req.body.subjects;
  }
}

    
      const files = req.files as Express.Multer.File[]; 
      const documents = (files ?? []).map((file) => ({
        url: (file as any).path,
        filename: file.originalname,
        uploadedAt: new Date(),
      }));

    
      const result = await this.createteacherUseCase.execute({
        name,
        email,
        phone,
        role,
        blocked,
        gender,
        Password,
        documents,
        subjects: subjectsArray,
        department,
      });

      res.status(StatusCodes.OK).json({
        message: "Successfully created teacher. Password sent to email.",
        teachers: result,
      });
    } catch (error: any) {
      logger.info(error);

      if (
        error.message === "email already exists" ||
        error.message === "enter valid phone number"
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
            const {name,email,phone,gender,subjects,department}=req.body;
        const {id}=req.params;

        let parsedsubject : {name:string;code:string}[]=[]
        if(subjects){
            if(typeof subjects==="string"){
                try {
                    parsedsubject=JSON.parse(subjects)
                    if(!Array.isArray(parsedsubject))parsedsubject=[];
                } catch (error) {
                    parsedsubject=[];
                }
            }else if(Array.isArray(subjects)){
                 parsedsubject=subjects
            }
        }

           const files = req.files as Express.Multer.File[]; 
            const documents = (files ?? []).map(file => ({
            url: (file as any).path,
           filename: file.originalname,
           uploadedAt: new Date(),
           }));

            const updateData: any = { name, email, phone, gender, department };
         if (parsedsubject.length > 0) updateData.subjects = parsedsubject;
          if (documents.length > 0) updateData.documents = documents;

         const updatedTeacher = await this.updateTeacherUseCase.execute(id, updateData);
     
          res.status(StatusCodes.OK).json({
          message: "Successfully updated teacher",
          teacher: updatedTeacher,
         });  

         


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