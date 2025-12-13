import { PeymentTransactrion } from "../../entities/FeeType/PaymentTransaction";


export interface IPaymentStatusUpdateFeID{
    execute(id:string,peyment:PeymentTransactrion):Promise<PeymentTransactrion|null>
}