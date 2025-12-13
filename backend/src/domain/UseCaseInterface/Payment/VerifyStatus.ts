import { PeymentTransactrion } from "../../entities/FeeType/PaymentTransaction";
export interface IVerifyStatusChange{
    execute(id:string,peyment:PeymentTransactrion):Promise<PeymentTransactrion|null>
}