import { CreateLeaveDTO } from "../../dto/LeaveManagement/CreateLeaveManagementDTO";
import { ICreateLeaveusecase } from "../../../domain/UseCaseInterface/LeaveManagement/ICreateLeaveUseCase";
import { InterfaceLeaveManagement } from "../../../domain/repositories/ILeaveManagement/ILeaveManagement";
import { LeaveManagementEntity } from "../../../domain/entities/LeaveManagement/LeaveManagementEntity";
export class CreateLeaveUseCase implements ICreateLeaveusecase {
  constructor(
    private readonly create: InterfaceLeaveManagement
  ) { }

  async execute(
    teacherId: string,
    data: CreateLeaveDTO
  ): Promise<LeaveManagementEntity> {

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid date format");
    }

    const overlap = await this.create.findOverlappingLeave(
      teacherId,
      startDate,
      endDate
    );

    if (overlap) {
      throw new Error("Already existing leave in this period");
    }

    const totalDays =
      (endDate.getTime() - startDate.getTime()) /
      (1000 * 60 * 60 * 24) +
      1;

    const leaveMonth = startDate.getMonth() + 1;
    const leaveYear = startDate.getFullYear();

    const currentMonthLeaves = await this.create.countLeavesByTypeAndMonth(
      teacherId,
      data.leaveType,
      leaveMonth,
      leaveYear
    );

    let warningMessage = "";
    if (
      (data.leaveType === "CASUAL" || data.leaveType === "SICK") &&
      currentMonthLeaves >= 1
    ) {
      warningMessage = `Monthly limit exceeded for ${data.leaveType} leave. already taken ${currentMonthLeaves} leaves in this month`;
    }

    const leaveEntity = new LeaveManagementEntity(
      "",
      teacherId,
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
      warningMessage
    );

    return await this.create.create(leaveEntity);
  }
}
