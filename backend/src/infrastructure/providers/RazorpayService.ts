import { razorpayInstance } from "../config/Razorpay";


export class RazorpayServices{
    async CreateOrder(amount:number,currency:string){
        try {
            const options={
                amount:amount*100,
                currency,
                receipt: `receipt_${Date.now()}`,
            }
             const order = await razorpayInstance.orders.create(options);
                 return {
                   id: order.id,
                   amount: amount,
                   currency: order.currency,
                };
        } catch (error) {
            console.error("Razorpay order creation failed:", error);
            throw new Error("Failed to create Razorpay order");
        }
    }
}