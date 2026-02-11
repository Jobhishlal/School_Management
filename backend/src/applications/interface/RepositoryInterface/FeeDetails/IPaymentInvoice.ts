
export interface IPaymentTransactionRepositoryInvoice{
    updateinvoiceurl(paymentId:string,invoiceurl:string):Promise<void>;
    findById(paymentId:string):Promise<any>;
    findsttudentBypayment(feeId:string):Promise<any>

}