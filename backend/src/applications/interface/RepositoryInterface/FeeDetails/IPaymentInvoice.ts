
export interface IPaymentTransactionRepositoryInvoice{
    updateinvoiceurl(paymentId:string,invoiceurl:string):Promise<void>;
    findById(paymentId:string):Promise<ReturnType<typeof JSON.parse>>;
    findsttudentBypayment(feeId:string):Promise<ReturnType<typeof JSON.parse>>

}