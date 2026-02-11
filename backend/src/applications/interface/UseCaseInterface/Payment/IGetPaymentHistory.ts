import { PeymentTransactrion } from "../../../../domain/entities/FeeType/PaymentTransaction";

export interface IGetPaymentHistory {
    execute(filter: any, page: number, limit: number): Promise<{ payments: any[]; total: number }>;
}
