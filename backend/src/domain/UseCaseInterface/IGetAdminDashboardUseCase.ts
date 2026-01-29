import { AdminDashboardDTO } from "../../applications/dto/AdminDashboardDTO";

export interface IGetAdminDashboardUseCase {
    execute(): Promise<AdminDashboardDTO>;
}
