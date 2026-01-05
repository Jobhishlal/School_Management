import { PeymentTransactrion } from "../../entities/FeeType/PaymentTransaction";

export interface IGetParentPaymentHistory {
    execute(studentId: string, page: number, limit: number): Promise<{ payments: any[]; total: number }>;
}
