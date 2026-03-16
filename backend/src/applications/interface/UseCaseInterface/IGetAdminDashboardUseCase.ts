import { AdminDashboardDTO } from "../../dto/AdminDashboardDTO";

export interface IGetAdminDashboardUseCase {
    execute(): Promise<AdminDashboardDTO>;
}
