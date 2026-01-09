import { ObjectId } from "mongoose";
import { LeaveManagementEntity } from "../../entities/LeaveManagement/LeaveManagementEntity";

export interface InterfaceLeaveManagement {
  create(leave: LeaveManagementEntity): Promise<LeaveManagementEntity>
  findOverlappingLeave(
    teacherId: string,
    startDate: Date,
    endDate: Date
  ): Promise<LeaveManagementEntity | null>;
  countLeavesByTypeAndMonth(
    teacherId: string,
    leaveType: string,
    month: number,
    year: number
  ): Promise<number>;
  getLeavesByTeacherId(teacherId: string): Promise<LeaveManagementEntity[]>;
  getAllLeaves(): Promise<LeaveManagementEntity[]>;
  updateStatus(
    leaveId: string,
    status: string,
    actionBy: string,
    adminRemark?: string
  ): Promise<LeaveManagementEntity | null>;
}