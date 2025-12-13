import { Request, Response } from "express";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { ICreateRazorpayOrder } from "../../../../domain/UseCaseInterface/Payment/RazorpayUseCase";
import { IVerifyStatusChange } from "../../../../domain/UseCaseInterface/Payment/VerifyStatus";
import { PeymentTransactrion } from "../../../../domain/entities/FeeType/PaymentTransaction";
import { IPaymentStatusUpdateFeID } from "../../../../domain/UseCaseInterface/Payment/IPaymentStatusUpdatefeeIdbase";
import { IDownloadInvoicePDF } from "../../../../domain/UseCaseInterface/FeeStructure/IInvoiceDownloadUseCase";
import { error } from "console";

export class PeymentController {
  constructor(
    private readonly Createrepo: ICreateRazorpayOrder,
    private readonly Verifystatus:IVerifyStatusChange,
    private readonly verifyByFeeIdUseCase:IPaymentStatusUpdateFeID,
    private readonly invoicedownloadUseCase:IDownloadInvoicePDF

  ) {}

  async CreatePayment(req: Request, res: Response): Promise<void> {
    try {
      console.log(" Payment request reached backend");

      const { amount, studentId, feeRecordId, method } = req.body;

      if (!amount || !studentId || !feeRecordId) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Missing required fields: amount, studentId, or feeRecordId",
        });
        return;
      }

      console.log(" Payment request details:", { amount, studentId, feeRecordId, method });

      const order = await this.Createrepo.execute({
        amount,
        currency: "INR",
        studentId,
        feeRecordId,
        method: method || "razorpay",
      });

      console.log(" Razorpay order created:", order);

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Razorpay order created successfully",
        data: order,
      });
    } catch (error: any) {
      console.error(" Payment creation failed:", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Something went wrong during payment creation",
      });
    }
  }

  async StatusChange(req:Request,res:Response):Promise<void>{
    try {
     const { id } = req.params;
     console.log("id getit",id)
      const { paymentId, razorpaySignature, status, method } = req.body;

    const payment = new PeymentTransactrion(
       id,
       "",
       "",
       "",
       paymentId,
       0,
       status,
       new Date(),
       undefined,
       method,
       razorpaySignature
      );
  console.log('payment data',payment)
      const result = await this.Verifystatus.execute(id, payment);

      console.log("Updated payment:", result);

      res.status(StatusCodes.CREATED)
      .json({
        success:true,
        message:"Peyment status update successfully",
        data:result
      })
    } catch (error:any) {
      console.log("error",error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({success:false,message:"internal server error",error})
      
    }
  }

 async StatusChangeByFeeId(req: Request, res: Response): Promise<void> {
  try {
    console.log("i am reacheed here")
    const { feeId } = req.params;
    console.log("feeId also getit",feeId)
    const { paymentId, razorpaySignature, status, method } = req.body;
    console.log("req.body data",req.body)

    if (!feeId || !paymentId || !status) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Missing required fields" });
      return;
    }

    const payment = new PeymentTransactrion(
      "",
      "", 
      feeId,
      "", 
      paymentId,
      0, 
      status,
      new Date(),
      undefined, 
      method,
      razorpaySignature
    );

    const result = await this.verifyByFeeIdUseCase.execute(feeId, payment);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Payment status updated successfully",
      data: result
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal server error", error });
  }
}

 async InvoiceDownload(req:Request,res:Response):Promise<void>{
  try {
    console.log("it will reached invoice controller")
    const paymentId =req.params.paymentId;
    console.log("paymentId",paymentId)
    if(!paymentId){
       res.status(StatusCodes.BAD_REQUEST)
      .json({error:"Does not get it paymentId"})
    }
       const pdfBuffer = await this.invoicedownloadUseCase.execute(paymentId)
       res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice-${paymentId}.pdf`,
       });   
       res.send(pdfBuffer);
      } catch (error:any) {
        console.log("error",error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).
      json({ error: error.message || "Failed to download invoice." });
      }
 }

}
