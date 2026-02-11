import { IDownloadInvoicePDF } from "../../interface/UseCaseInterface/FeeStructure/IInvoiceDownloadUseCase";
import { IPaymentTransactionRepository } from "../../interface/RepositoryInterface/FeeDetails/IPaymentTransactionRepository";
import { generateAndUploadInvoice } from "../../../shared/constants/utils/generateInvoice";
import { InvoiceData } from "../../../presentation/http/interface/InvoiceData";

export class DownLoadInvoice implements IDownloadInvoicePDF {

  constructor(private readonly repo: IPaymentTransactionRepository) {}

  async execute(paymentId: string): Promise<Buffer> {

  if (!paymentId) {
    throw new Error("Payment ID is required.");
  }


  const payment = await this.repo.findById(paymentId);

  if (!payment) {
    throw new Error("Payment record not found.");
  }

  const institute = await this.repo.getInstitute();
  if (!institute) {
    throw new Error("Institute details not found.");
  }

 

  const feeTypeName =
    payment.studentFeeId?.name ||
    payment.studentFeeId?.feeItems?.[0]?.name ||
    "Unknown Fee";

  const feeDescription =
    payment.studentFeeId?.feeItems?.[0]?.notes ||    
    payment.studentFeeId?.notes ||                    
    "No description available";


  console.log("Payment:", payment);
  console.log("Fee Type:", feeTypeName);
  console.log("Fee Description:", feeDescription);


  const invoiceData: InvoiceData = {
    studentName: payment.studentId?.fullName || "Unknown",
    studentId: payment.studentId?.studentId || "Unknown",

    paymentId: payment._id?.toString(),
    transactionId: payment.razorpayPaymentId || "N/A",

    amount: payment.amount,
    date: payment.paymentDate || payment.createdAt || new Date(),
    method: payment.method || "N/A",
    status: payment.status,

    instituteName: institute.instituteName,
    instituteEmail: institute.email,
    institutePhone: institute.phone,
    instituteAddress: institute.contactInformation,
    instituteLogo: institute?.logo?.[0]?.url || null,

    feeTypeName,
    feeDescription,
  };


  const { pdfBuffer, invoiceUrl } = await generateAndUploadInvoice(invoiceData);


  await this.repo.updateinvoiceurl(paymentId, invoiceUrl);

  return pdfBuffer;
}

}
