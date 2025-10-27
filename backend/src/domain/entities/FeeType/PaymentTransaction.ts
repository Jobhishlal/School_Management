export class PeymentTransactrion{
    constructor(
    public readonly id:string,
    public studentId: string,
    public feeRecordId: string,
    public orderId: string,          
    public paymentId: string | null, 
    public amount: number,
    public status: 'Created' | 'Paid' | 'Failed' | 'Refunded',
    public createdAt: Date,
    public paidAt?: Date,
    public method?: string,
    public razorpaySignature?: string
    ){

    }
}