import { Request,Response } from "express";

export interface ITeacherCreatecontroller{
    createteacher(req:Request,res:Response):Promise<void>
    getAllTeacher(req:Request,res:Response):Promise<void>
    updateTeacher(req:Request,res:Response):Promise<void>
    blockTeacher(req:Request,res:Response):Promise<void>;
}