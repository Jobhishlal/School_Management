import { FeeStructureModel } from "../../database/models/FeeManagement/FeeStructure";
import { FeeStructureMapper } from "../../../domain/Mapper/FeeStructureMapper";
import { FeeStructure } from "../../../domain/entities/FeeType/FeeStructure";
import { BaseRepository } from "../BASEREPOSITORIES/Baserepository";
import { IFeeStructureRepository } from "../../../domain/repositories/FeeDetails/IFeeStructureRepository";
import { PaymentModel } from "../../database/models/FeeManagement/Payment";
import { StudentModel } from "../../database/models/StudentModel";

import mongoose from "mongoose";
import { match } from "assert";


export class FeeStructureRepository implements IFeeStructureRepository {
  async create(feestructure: FeeStructure): Promise<FeeStructure> {
    const data = FeeStructureMapper.toPersistence(feestructure);
    const model = await FeeStructureModel.create(data)
    return FeeStructureMapper.toDomain(model)
  }

  async findById(id: string): Promise<FeeStructure | null> {
    const model = await FeeStructureModel.findById(id)
    return model ? FeeStructureMapper.toDomain(model) : null

  }

  async findClassWisePaymentStatus(classId: string, page: number, limit: number): Promise<{ students: any[], total: number }> {

    const classObjectId = new mongoose.Types.ObjectId(classId);
    const skip = (page - 1) * limit;

    const fee = await FeeStructureModel.findOne({ classId: classObjectId }).lean();

    if (!fee) {
      throw new Error("Fee structure not found");
    }

    const totalAmount = fee.feeItems.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    const aggregationPipeline: any[] = [
      { $match: { classId: classObjectId } },
      // Lookups
      {
        $lookup: {
          from: "studentfees",
          let: { studentId: "$_id", feeStructureId: fee._id },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$studentId", "$$studentId"] },
                    { $eq: ["$feeStructureId", "$$feeStructureId"] }
                  ]
                }
              }
            }
          ],
          as: "studentFee"
        }
      },
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "studentId",
          as: "payments"
        }
      },
      {
        $addFields: {
          totalPaid: { $sum: "$payments.amount" },
          studentFeeDoc: { $arrayElemAt: ["$studentFee", 0] }
        }
      },
      { $sort: { _id: -1 } }, // Newest students first
    ];

    const facetedData = await StudentModel.aggregate([
      ...aggregationPipeline,
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: limit }]
        }
      }
    ]);

    const result = facetedData[0];
    const total = result.metadata[0] ? result.metadata[0].total : 0;
    const students = result.data;

    const mappedStudents = students.map((student: any) => {
      let remainingPaid = student.totalPaid;

      const feeItemsStatus = fee.feeItems.map(item => {
        let paidAmount = 0;

        if (remainingPaid >= item.amount) {
          paidAmount = item.amount;
          remainingPaid -= item.amount;
        } else if (remainingPaid > 0) {
          paidAmount = remainingPaid;
          remainingPaid = 0;
        }

        return {
          name: item.name,
          amount: item.amount,
          paidAmount,
          status:
            paidAmount === item.amount
              ? "PAID"
              : paidAmount > 0
                ? "PARTIAL"
                : "NOT_PAID"
        };
      });

      const paymentStatus =
        student.totalPaid >= totalAmount
          ? "COMPLETED"
          : student.totalPaid > 0
            ? "PARTIAL"
            : "NOT_PAID";

      return {
        studentId: student._id,
        studentName: student.fullName,
        paymentStatus,
        feeStructure: {
          _id: student.studentFeeDoc?._id,
          name: fee.name,
          academicYear: fee.academicYear,
          notes: fee.notes,
          items: feeItemsStatus,
          totalAmount,
          totalPaid: student.totalPaid
        }
      };
    });

    return { students: mappedStudents, total };
  }

  async findStudentPaymentStatusByName(studentName: string): Promise<any[]> {
    const students = await StudentModel.aggregate([
      {
        $match: {
          fullName: { $regex: `^${studentName}`, $options: "i" }

        }
      },
      {
        $lookup: {
          from: "feestructures",
          localField: "classId",
          foreignField: "classId",
          as: "feeStructures"
        }
      },

      {
        $unwind: {
          path: "$feeStructures",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "studentId",
          as: "payments"
        }
      },
      {
        $addFields: {
          totalPaid: { $sum: "$payments.amount" }
        }
      }
    ]);

    return students.map(student => {
      const fee = student.feeStructures;

      if (!fee) {
        return {
          studentId: student._id,
          studentName: student.fullName,
          paymentStatus: "NOT_PAID",
          feeStructure: null
        };
      }

      const totalAmount = fee.feeItems.reduce(
        (sum: number, item: any) => sum + item.amount,
        0
      );

      let remainingPaid = student.totalPaid;

      const feeItemsStatus = fee.feeItems.map((item: any) => {
        let paidAmount = 0;

        if (remainingPaid >= item.amount) {
          paidAmount = item.amount;
          remainingPaid -= item.amount;
        } else if (remainingPaid > 0) {
          paidAmount = remainingPaid;
          remainingPaid = 0;
        }

        return {
          name: item.name,
          amount: item.amount,
          paidAmount,
          status:
            paidAmount === item.amount
              ? "PAID"
              : paidAmount > 0
                ? "PARTIAL"
                : "NOT_PAID"
        };
      });

      return {
        studentId: student._id,
        studentName: student.fullName,
        paymentStatus:
          student.totalPaid >= totalAmount
            ? "COMPLETED"
            : student.totalPaid > 0
              ? "PARTIAL"
              : "NOT_PAID",
        feeStructure: {
          name: fee.name,
          academicYear: fee.academicYear,
          notes: fee.notes,
          items: feeItemsStatus,
          totalAmount,
          totalPaid: student.totalPaid
        }
      };
    });
  }

  async findAll(): Promise<FeeStructure[]> {
    const docs = await FeeStructureModel.find().lean();
    return docs.map(doc => FeeStructureMapper.toDomain(doc));
  }

  async getTotalExpectedFees(): Promise<number> {
    const feeStructures = await FeeStructureModel.find().lean();
    let totalExpected = 0;

    for (const fee of feeStructures) {
      if (!fee.classId) continue;

      const studentCount = await StudentModel.countDocuments({ classId: fee.classId });
      const feeAmount = fee.feeItems.reduce((sum: number, item: any) => sum + item.amount, 0);

      totalExpected += (studentCount * feeAmount);
    }
    return totalExpected;
  }
}