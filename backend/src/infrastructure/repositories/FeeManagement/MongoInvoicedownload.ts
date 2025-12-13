import { PaymentModel } from "../../database/models/FeeManagement/Payment";
import { PeymentTransactrion } from "../../../domain/entities/FeeType/PaymentTransaction";
import { IPaymentTransactionRepositoryInvoice } from "../../../domain/repositories/FeeDetails/IPaymentInvoice";
import { StudentModel } from "../../database/models/StudentModel";


export class RepoMongoInvoice implements IPaymentTransactionRepositoryInvoice{
  async updateinvoiceurl(paymentId: string, invoiceUrl: string): Promise<void> {
      const data = await PaymentModel.findByIdAndUpdate(paymentId,{invoiceUrl})
     
  }

  async findById(paymentId: string): Promise<any> {
      return PaymentModel.findById(paymentId).lean()
  }
   
  async findsttudentBypayment(feeId: string): Promise<any> {
      return StudentModel.findOne({feeStructures:{$in:[feeId]}}).lean()
  }
}