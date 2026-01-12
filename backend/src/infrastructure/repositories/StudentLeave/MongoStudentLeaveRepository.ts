import { IStudentLeaveRepository } from "../../../domain/repositories/StudentLeave/IStudentLeaveRepository";
import { StudentLeaveEntity } from "../../../domain/entities/StudentLeave/StudentLeaveEntity";
import { StudentLeaveModel } from "../../database/models/StudentLeaveModel";
import { Types } from "mongoose";

export class MongoStudentLeaveRepository implements IStudentLeaveRepository {

    async applyLeave(leave: StudentLeaveEntity): Promise<StudentLeaveEntity> {
        const newLeave = await StudentLeaveModel.create({
            studentId: new Types.ObjectId(leave.studentId),
            classId: new Types.ObjectId(leave.classId),
            parentId: new Types.ObjectId(leave.parentId),
            leaveType: leave.leaveType,
            startDate: leave.startDate,
            endDate: leave.endDate,
            reason: leave.reason,
            status: leave.status,
            appliedAt: leave.appliedAt
        });
        return this.mapToEntity(newLeave);
    }

    async getLeavesByStudentId(studentId: string): Promise<StudentLeaveEntity[]> {
        const leaves = await StudentLeaveModel.find({ studentId: new Types.ObjectId(studentId) }).sort({ createdAt: -1 });
        return leaves.map(leave => this.mapToEntity(leave));
    }

    async getPendingLeavesByClassId(classId: string): Promise<StudentLeaveEntity[]> {
        const leaves = await StudentLeaveModel.find({
            classId: new Types.ObjectId(classId),
            status: "PENDING"
        })
            .populate("studentId", "fullName studentId") 
            .sort({ createdAt: 1 });
        return leaves.map(leave => this.mapToEntity(leave));
    }

    async updateLeaveStatus(leaveId: string, status: string, actionBy: string, message?: string): Promise<StudentLeaveEntity | null> {
        const updateData: any = {
            status: status,
            actionBy: new Types.ObjectId(actionBy),
            actionAt: new Date()
        };
        if (message) updateData.responseMessage = message;

        const updatedLeave = await StudentLeaveModel.findByIdAndUpdate(leaveId, updateData, { new: true }).populate("studentId");
        return updatedLeave ? this.mapToEntity(updatedLeave) : null;
    }

    async findById(id: string): Promise<StudentLeaveEntity | null> {
        const leave = await StudentLeaveModel.findById(id);
        return leave ? this.mapToEntity(leave) : null;
    }

    private mapToEntity(doc: any): StudentLeaveEntity {
        return new StudentLeaveEntity(
            doc._id.toString(),
            doc.studentId.fullName ? doc.studentId : (doc.studentId._id ? doc.studentId._id.toString() : doc.studentId.toString()),
            doc.classId.toString(),
            doc.parentId.toString(),
            doc.leaveType,
            doc.startDate,
            doc.endDate,
            doc.reason,
            doc.status,
            doc.appliedAt,
            doc.actionBy?.toString(),
            doc.actionAt,
            doc.responseMessage
        );
    }
}
