import { PeymentTransactrion } from "../../../../domain/entities/FeeType/PaymentTransaction";

export interface IGetPaymentHistory {
    execute(filter: ReturnType<typeof JSON.parse>, page: number, limit: number): Promise<{ payments: ReturnType<typeof JSON.parse>[]; total: number }>;
}
