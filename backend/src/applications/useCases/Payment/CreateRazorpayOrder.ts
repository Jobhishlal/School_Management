import { ICreateRazorpayOrder } from "../../../domain/UseCaseInterface/Payment/RazorpayUseCase";
import { RazorpayServices } from "../../../infrastructure/providers/RazorpayService";


export class CreateRazorpayOrder implements ICreateRazorpayOrder {
  constructor(private razorpayService: RazorpayServices) {}

  async execute({ amount, currency = "INR" }: { amount: number; currency?: string }) {
    if (!amount || amount <= 0) {
      throw new Error("Invalid amount");
    }

    const order = await this.razorpayService.CreateOrder(amount, currency);
    return order;
  }
}