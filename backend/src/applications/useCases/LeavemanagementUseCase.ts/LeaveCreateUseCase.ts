import { CreateLeaveDTO } from "../../dto/LeaveManagement/CreateLeaveManagementDTO";
import { ICreateLeaveusecase } from "../../interface/UseCaseInterface/LeaveManagement/ICreateLeaveUseCase";
import { InterfaceLeaveManagement } from "../../interface/RepositoryInterface/ILeaveManagement/ILeaveManagement";
import { LeaveManagementEntity } from "../../../domain/entities/LeaveManagement/LeaveManagementEntity";
import { ITeacherCreate } from "../../interface/RepositoryInterface/TeacherCreate";
import { ValidateLeaveCreate } from "../../validators/LeaveValidation/LeaveCreateValidation";

export class CreateLeaveUseCase implements ICreateLeaveusecase {
  constructor(
    private readonly create: InterfaceLeaveManagement,
    private readonly teacherRepo: ITeacherCreate
  ) { }

  async execute(
    teacherId: string,
    data: CreateLeaveDTO
  ): Promise<LeaveManagementEntity> {

    ValidateLeaveCreate(data)

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


    if (data.leaveType === "CASUAL" || data.leaveType === "SICK") {
      const teacher = await this.teacherRepo.findById(teacherId);
      if (!teacher) {
        throw new Error("Teacher not found");
      }

      const balance =
        data.leaveType === "SICK"
          ? (teacher.leaveBalance?.sickLeave ?? 0)
          : (teacher.leaveBalance?.casualLeave ?? 0);

      if (balance < totalDays) {
        throw new Error(
          `Insufficient ${data.leaveType.toLowerCase()} leave balance. Available: ${balance} days, Requested: ${totalDays} days.`
        );
      }
    }

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
      currentMonthLeaves >= 5
    ) {
      warningMessage = `Monthly limit exceeded for ${data.leaveType} leave. already taken ${currentMonthLeaves} leaves in this month`;
    }

    const leaveEntity = new LeaveManagementEntity(
      "",
      teacherId,
      undefined, 
      "TEACHER", 
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
