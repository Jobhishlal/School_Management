import { RESPONSE_MESSAGES } from "../../../../shared/constants/responseMessages";
import { Request, Response } from "express";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { ICreateRazorpayOrder } from "../../../../applications/interface/UseCaseInterface/Payment/RazorpayUseCase";
import { IVerifyStatusChange } from "../../../../applications/interface/UseCaseInterface/Payment/VerifyStatus";
import { PeymentTransactrion } from "../../../../domain/entities/FeeType/PaymentTransaction";
import { IPaymentStatusUpdateFeID } from "../../../../applications/interface/UseCaseInterface/Payment/IPaymentStatusUpdatefeeIdbase";
import { IDownloadInvoicePDF } from "../../../../applications/interface/UseCaseInterface/FeeStructure/IInvoiceDownloadUseCase";


import { IGetPaymentHistory } from "../../../../applications/interface/UseCaseInterface/Payment/IGetPaymentHistory";
import { IGetParentPaymentHistory } from "../../../../applications/interface/UseCaseInterface/Payment/IGetParentPaymentHistory";


export class PeymentController {
  constructor(
    private readonly Createrepo: ICreateRazorpayOrder,
    private readonly Verifystatus: IVerifyStatusChange,
    private readonly verifyByFeeIdUseCase: IPaymentStatusUpdateFeID,
    private readonly invoicedownloadUseCase: IDownloadInvoicePDF,
    private readonly getPaymentHistoryUseCase: IGetPaymentHistory,
    private readonly getParentPaymentHistoryUseCase: IGetParentPaymentHistory
  ) { }

  async CreatePayment(req: Request, res: Response): Promise<void> {
    try {
      console.log(" Payment request reached backend");

      const { amount, studentId, feeRecordId, method } = req.body;

      if (!amount || !studentId || !feeRecordId) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: RESPONSE_MESSAGES.MISSING_REQUIRED_FIELDS_AMOUNT_STUDENTID_OR_FEEREC,
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
        message: RESPONSE_MESSAGES.RAZORPAY_ORDER_CREATED_SUCCESSFULLY,
        data: order,
      });
    } catch (error: unknown) {
      console.error(" Payment creation failed:", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message || "Something went wrong during payment creation",
      });
    }
  }

  async StatusChange(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      console.log("id getit", id)
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
      console.log('payment data', payment)
      const result = await this.Verifystatus.execute(id, payment);

      console.log("Updated payment:", result);

      res.status(StatusCodes.CREATED)
        .json({
          success: true,
          message: RESPONSE_MESSAGES.PEYMENT_STATUS_UPDATE_SUCCESSFULLY,
          data: result
        })
    } catch (error: unknown) {
      console.log("error", error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR_1, error })

    }
  }

  async StatusChangeByFeeId(req: Request, res: Response): Promise<void> {
    try {
      console.log("i am reacheed here")
      const { feeId } = req.params;
      console.log("feeId also getit", feeId)
      const { paymentId, razorpaySignature, status, method } = req.body;
      console.log("req.body data", req.body)

      if (!feeId || !paymentId || !status) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: RESPONSE_MESSAGES.MISSING_REQUIRED_FIELDS });
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
        message: RESPONSE_MESSAGES.PAYMENT_STATUS_UPDATED_SUCCESSFULLY,
        data: result
      });
    } catch (error) {
      console.error("Error updating payment status:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR, error });
    }
  }

  async InvoiceDownload(req: Request, res: Response): Promise<void> {
    try {
      console.log("it will reached invoice controller")
      const paymentId = req.params.paymentId;
      console.log("paymentId", paymentId)
      if (!paymentId) {
        res.status(StatusCodes.BAD_REQUEST)
          .json({ error: "Does not get it paymentId" })
      }
      const pdfBuffer = await this.invoicedownloadUseCase.execute(paymentId)
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice-${paymentId}.pdf`,
      });
      res.send(pdfBuffer);
    } catch (error: unknown) {
      console.log("error", error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).
        json({ error: (error as Error).message || "Failed to download invoice." });
    }
  }

  async GetPaymentHistory(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { feeStructureId, startDate, endDate } = req.query;

      const result = await this.getPaymentHistoryUseCase.execute(
        { feeStructureId, startDate, endDate },
        page,
        limit
      );

      res.status(StatusCodes.OK).json({
        success: true,
        data: result.payments,
        total: result.total,
        page,
        limit,
      });
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: RESPONSE_MESSAGES.FAILED_TO_FETCH_PAYMENT_HISTORY,
        error: (error as Error).message,
      });
    }
  }

  async GetParentPaymentHistory(req: Request, res: Response): Promise<void> {
    try {
      const { studentId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!studentId) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: RESPONSE_MESSAGES.STUDENT_ID_IS_REQUIRED,
        });
        return;
      }

      const result = await this.getParentPaymentHistoryUseCase.execute(
        studentId,
        page,
        limit
      );

      res.status(StatusCodes.OK).json({
        success: true,
        data: result.payments,
        total: result.total,
        page,
        limit,
      });
    } catch (error: unknown) {
      console.error("Error fetching parent payment history:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: RESPONSE_MESSAGES.FAILED_TO_FETCH_PAYMENT_HISTORY,
        error: (error as Error).message,
      });
    }
  }
}
