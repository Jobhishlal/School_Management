export interface InvoiceData{
    studentName:string;
    studentId: string;
    paymentId: string;
    transactionId?: string;
    amount: number;
    date: Date;
    method: string;
    status: string;   
    instituteName:string;
    instituteEmail:string;
    institutePhone:string;
    instituteAddress:string;
    instituteLogo:string;
   feeTypeName:string;
   feeDescription:string;
}