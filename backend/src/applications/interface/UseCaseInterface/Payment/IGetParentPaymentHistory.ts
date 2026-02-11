import { PeymentTransactrion } from "../../../../domain/entities/FeeType/PaymentTransaction";

export interface IGetParentPaymentHistory {
    execute(studentId: string, page: number, limit: number): Promise<{ payments: any[]; total: number }>;
}
