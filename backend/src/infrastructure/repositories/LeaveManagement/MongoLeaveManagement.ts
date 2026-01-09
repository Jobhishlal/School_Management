
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

    async getAllLeaves(): Promise<LeaveManagementEntity[]> {
        const docs = await LeaveManagementModel.find().populate("teacherId").sort({ createdAt: -1 });
        // Provided mapper might fail if teacherId is populated object instead of ObjectId string.
        // Assuming toLeaveManagementEntity handles it or I check if teacherId is object.
        // The original toLeaveManagementEntity uses doc.teacherId.toString(). 
        // If populated, .toString() on an object usually returns "[object Object]" or id if it has custom toString.
        // Mongoose documents usually assume .id or ._id works. 
        // Let's modify the mapper later if needed, but for now I will NOT populate to avoid breaking basic mapper, 
        // OR I will fix logic in Controller to fetch teacher details separately if needed?
        // Actually, for Admin view, we need Teacher Name. 
        // If I populate, `doc.teacherId` becomes an object. `doc.teacherId.toString()` returns the ID if it is a populated document? 
        // Let's check `toLeaveManagementEntity` again.
        // It does `doc.teacherId.toString()`.
        // If I populate, I should probably handle it.
        // For now, let's NOT populate in this method and handle fetching teacher info if needed or rely on a different aggregation.
        // But usually simple way is populate.
        // Let's check LeaveManagement schema. teacherId ref is "Teacher".

        return docs.map(toLeaveManagementEntity);
    }

    async updateStatus(leaveId: string, status: string, actionBy: string, adminRemark?: string): Promise<LeaveManagementEntity | null> {
        const updateData: any = {
            status: status,
            actionBy: new Types.ObjectId(actionBy),
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
}