import { Request,Response } from "express";

export interface ISubAdminCreate{
    createSubAdmin(req:Request,res:Response):Promise<void>
    getAllSubAdmins(req:Request,res:Response):Promise<void>
    updatesubAdmin(req:Request,res:Response):Promise<void>
    subadminblock(req:Request,res:Response):Promise<void>
}