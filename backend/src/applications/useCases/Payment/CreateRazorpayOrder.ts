import { ICreateRazorpayOrder } from "../../interface/UseCaseInterface/Payment/RazorpayUseCase";
import { RazorpayServices } from "../../../infrastructure/providers/RazorpayService"; 
import { IPaymentTransactionRepository } from "../../../domain/repositories/FeeDetails/IPaymentTransactionRepository";
import { PeymentTransactrion } from "../../../domain/entities/FeeType/PaymentTransaction";

export class CreateRazorpayOrder implements ICreateRazorpayOrder {
  constructor(
    private readonly razorpayService: RazorpayServices,
    private readonly paymentRepo: IPaymentTransactionRepository
  ) {}

  async execute(data: {
    amount: number;
    currency: string;
    studentId: string;
    feeRecordId: string;
    method: string;
  }): Promise<{ id: string; amount: number; currency: string }> {
    
   
    const order = await this.razorpayService.CreateOrder(data.amount, data.currency);

    
    const paymentEntity = new PeymentTransactrion(
      "",               
      data.studentId,  
      data.feeRecordId, 
      order.id,          
      null,             
      data.amount,
      "PENDING",
      new Date(),       
      undefined,         
      data.method
    );

    await this.paymentRepo.create(paymentEntity);

    return {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  }
}
