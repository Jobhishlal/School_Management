import { Request,Response } from "express";

export interface ISubAdminCreate{
    createSubAdmin(req:Request,res:Response):Promise<void>
}