import { ParentDashboardStatsDTO } from "../../../dto/Parent/ParentDashboardStatsDTO";

export interface IGetParentDashboardStatsUseCase {
    execute(parentId: string): Promise<ParentDashboardStatsDTO>;
}
