import { Request,Response } from "express";

export interface IGoogleController{
    callback(req:Request,res:Response):Promise<void>
}