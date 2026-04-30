import { PaymentModel } from "../../database/models/FeeManagement/Payment";
import { PeymentTransactrion } from "../../../domain/entities/FeeType/PaymentTransaction";
import { IPaymentTransactionRepositoryInvoice } from "../../../applications/interface/RepositoryInterface/FeeDetails/IPaymentInvoice";
import { StudentModel } from "../../database/models/StudentModel";


export class RepoMongoInvoice implements IPaymentTransactionRepositoryInvoice{
  async updateinvoiceurl(paymentId: string, invoiceUrl: string): Promise<void> {
      const data = await PaymentModel.findByIdAndUpdate(paymentId,{invoiceUrl})
     
  }

  async findById(paymentId: string): Promise<ReturnType<typeof JSON.parse>> {
      return PaymentModel.findById(paymentId).lean()
  }
   
  async findsttudentBypayment(feeId: string): Promise<ReturnType<typeof JSON.parse>> {
      return StudentModel.findOne({feeStructures:{$in:[feeId]}}).lean()
  }
}