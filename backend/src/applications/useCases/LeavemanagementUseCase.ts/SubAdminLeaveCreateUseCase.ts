import { CreateLeaveDTO } from "../../dto/LeaveManagement/CreateLeaveManagementDTO";
import { InterfaceLeaveManagement } from "../../interface/RepositoryInterface/ILeaveManagement/ILeaveManagement";
import { LeaveManagementEntity } from "../../../domain/entities/LeaveManagement/LeaveManagementEntity";
import { ValidateLeaveCreate } from "../../validators/LeaveValidation/LeaveCreateValidation";
import { SubAdminRepository } from "../../interface/RepositoryInterface/SubAdminCreate";

export interface ICreateSubAdminLeaveUseCase {
    execute(subAdminId: string, data: CreateLeaveDTO): Promise<LeaveManagementEntity>;
}

export class SubAdminLeaveCreateUseCase implements ICreateSubAdminLeaveUseCase {
    constructor(
        private readonly create: InterfaceLeaveManagement,
        private readonly subAdminRepo: SubAdminRepository
    ) { }

    async execute(
        subAdminId: string,
        data: CreateLeaveDTO
    ): Promise<LeaveManagementEntity> {

        ValidateLeaveCreate(data)

        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error("Invalid date format");
        }

        const totalDays =
            (endDate.getTime() - startDate.getTime()) /
            (1000 * 60 * 60 * 24) +
            1;

        if (data.leaveType === "CASUAL" || data.leaveType === "SICK") {
            const subAdmin = await this.subAdminRepo.findById(subAdminId);
            if (!subAdmin) {
                throw new Error("SubAdmin not found");
            }

            const balance =
                data.leaveType === "SICK"
                    ? (subAdmin.leaveBalance?.sickLeave ?? 0)
                    : (subAdmin.leaveBalance?.casualLeave ?? 0);

            if (balance < totalDays) {
                throw new Error(
                    `Insufficient ${data.leaveType.toLowerCase()} leave balance. Available: ${balance} days, Requested: ${totalDays} days.`
                );
            }
        }

        const leaveEntity = new LeaveManagementEntity(
            "",
            undefined,
            subAdminId,
            "SUB_ADMIN",
            data.leaveType,
            startDate,
            endDate,
            totalDays,
            data.reason,
            "PENDING",
            new Date(),
            undefined,
            undefined,
            undefined,
            undefined
        );

        return await this.create.create(leaveEntity);
    }
}
