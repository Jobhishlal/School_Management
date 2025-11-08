import { Request,Response } from "express";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { CreateRazorpayOrder } from "../../../../applications/useCases/Payment/CreateRazorpayOrder";
import { RazorpayServices } from "../../../../infrastructure/providers/RazorpayService";
import { compareSync } from "bcryptjs";


export class PeymentController{
    constructor(
        private readonly Createrepo:CreateRazorpayOrder,
       
    ){}


    async CreatePayment(req:Request,res:Response):Promise<void>{
    
         try {
            console.log("reached here")
            const {amount}=req.body
            console.log("amount ",amount)
            const order = await this.Createrepo.execute({amount})
              
            console.log("orders",order)
            res.status(StatusCodes.OK)
            
            .json({
                success:true,
                message:"Razorpay order create successfully",
                data:order
            })
          
         } catch (error:any) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
                success:false,
                message:error.message||"something went wring"
            })
            
         }

    }
}