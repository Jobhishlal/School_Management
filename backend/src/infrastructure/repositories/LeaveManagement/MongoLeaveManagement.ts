
import {
    LeaveManagementModel,
    InterLeaveManagement
} from "../../database/models/Leavemanagement/LeaveManagement";
import { Types } from "mongoose";

import { InterfaceLeaveManagement } from "../../../domain/repositories/ILeaveManagement/ILeaveManagement";
import { LeaveManagementEntity } from "../../../domain/entities/LeaveManagement/LeaveManagementEntity";
import { toLeaveManagementEntity } from "../../../domain/Mapper/toLeaveManagementEntity";



export class LeaveManagementMongoRepo implements InterfaceLeaveManagement {

    async create(leave: LeaveManagementEntity): Promise<LeaveManagementEntity> {
        const doc = await LeaveManagementModel.create({
            teacherId: leave.teacherId,
            subAdminId: leave.subAdminId,
            applicantRole: leave.applicantRole,
            leaveType: leave.leaveType,
            startDate: leave.startDate,
            endDate: leave.endDate,
            totalDays: leave.totalDays,
            reason: leave.reason,
            status: leave.status,
            appliedAt: leave.appliedAt,
            actionBy: leave.actionBy,
            actionAt: leave.actionAt,
            adminRemark: leave.adminRemark,
            warningMessage: leave.warningMessage
        })
        return toLeaveManagementEntity(doc)
    }
    async findOverlappingLeave(teacherId: string, startDate: Date, endDate: Date): Promise<LeaveManagementEntity | null> {

        const doc = await LeaveManagementModel.findOne({
            teacherId: new Types.ObjectId(teacherId),
            status: { $in: ["PENDING", "APPROVED"] },
            startDate: { $lte: endDate },
            endDate: { $gte: startDate }
        })
        return doc ? toLeaveManagementEntity(doc) : null
    }

    async countLeavesByTypeAndMonth(teacherId: string, leaveType: string, month: number, year: number): Promise<number> {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        const count = await LeaveManagementModel.countDocuments({
            teacherId: new Types.ObjectId(teacherId),
            leaveType: leaveType,
            startDate: { $gte: startDate, $lte: endDate },
            status: { $in: ["PENDING", "APPROVED"] }
        });

        return count;
    }

    async getLeavesByTeacherId(teacherId: string): Promise<LeaveManagementEntity[]> {
        const docs = await LeaveManagementModel.find({ teacherId: new Types.ObjectId(teacherId) }).sort({ createdAt: -1 });
        return docs.map(toLeaveManagementEntity);
    }

    async getLeavesBySubAdminId(subAdminId: string): Promise<LeaveManagementEntity[]> {
        const docs = await LeaveManagementModel.find({ subAdminId: new Types.ObjectId(subAdminId) }).sort({ createdAt: -1 });
        return docs.map(toLeaveManagementEntity);
    }

    async getAllLeaves(): Promise<LeaveManagementEntity[]> {
        const docs = await LeaveManagementModel.find()
            .populate("teacherId")
            .populate("subAdminId")
            .sort({ createdAt: -1 });


        return docs.map(toLeaveManagementEntity);
    }

    async updateStatus(leaveId: string, status: string, actionBy: string, adminRemark?: string): Promise<LeaveManagementEntity | null> {
        const updateData: any = {
            status: status,
            actionBy: actionBy,
            actionAt: new Date(),
        };
        if (adminRemark) {
            updateData.adminRemark = adminRemark;
        }

        const doc = await LeaveManagementModel.findByIdAndUpdate(
            leaveId,
            updateData,
            { new: true }
        );
        return doc ? toLeaveManagementEntity(doc) : null;
    }

    async findById(id: string): Promise<LeaveManagementEntity | null> {
        const doc = await LeaveManagementModel.findById(id);
        return doc ? toLeaveManagementEntity(doc) : null;
    }
    async countPendingRequests(): Promise<number> {
        return await LeaveManagementModel.countDocuments({ status: "PENDING" });
    }

    async countStaffOnLeave(date: Date): Promise<number> {
        return await LeaveManagementModel.countDocuments({
            status: "APPROVED",
            startDate: { $lte: date },
            endDate: { $gte: date }
        });
    }
}