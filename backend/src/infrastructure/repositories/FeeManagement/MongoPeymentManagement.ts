import { PeymentTransactrion } from "../../../domain/entities/FeeType/PaymentTransaction";
import { PaymentModel, IPayment } from "../../database/models/FeeManagement/Payment";
import { IPaymentTransactionRepository } from "../../../domain/repositories/FeeDetails/IPaymentTransactionRepository";
import "../../database/models/FeeManagement/StudentFee";
import { InstituteModel } from "../../database/models/InstituteProfile";
import { FeeStructureModel } from "../../database/models/FeeManagement/FeeStructure";
export class MongoPeymentRepo implements IPaymentTransactionRepository {

  async create(txn: PeymentTransactrion): Promise<PeymentTransactrion> {
    const created = await PaymentModel.create({
      studentFeeId: txn.feeRecordId,
      studentId: txn.studentId,
      razorpayOrderId: txn.orderId,
      razorpayPaymentId: txn.paymentId,
      amount: txn.amount,
      status: this.mapStatusToDb(txn.status),
      method: txn.method,
      paymentDate: txn.paidAt,
    });

    return this.toDomain(created);
  }

  async findByOrderId(orderId: string): Promise<PeymentTransactrion | null> {
    const doc = await PaymentModel.findOne({ razorpayOrderId: orderId });
    return doc ? this.toDomain(doc) : null;
  }

  async updateByOrderId(
    orderId: string,
    updateData: Partial<PeymentTransactrion>
  ): Promise<PeymentTransactrion | null> {
    const updated = await PaymentModel.findOneAndUpdate(
      { razorpayOrderId: orderId },
      {
        razorpayPaymentId: updateData.paymentId,
        status: updateData.status
          ? this.mapStatusToDb(updateData.status)
          : undefined,
        paymentDate: updateData.paidAt,
        method: updateData.method,
      },
      { new: true }
    );

    return updated ? this.toDomain(updated) : null;
  }

async updatePaymentStatus(
  orderId: string,
  update: Partial<PeymentTransactrion>
): Promise<PeymentTransactrion | null> {
  const updated = await PaymentModel.findOneAndUpdate(
    { razorpayOrderId: orderId },
    {
      $set: {
        status: update.status?.toUpperCase(),
        razorpayPaymentId: update.paymentId,
        paymentDate: update.paidAt || new Date(),
        method: update.method,
        razorpaySignature: update.razorpaySignature,
      },
    },
    { new: true }
  );

  return updated ? this.toDomain(updated) : null;
}

async updatePaymentStatusByFeeId(
  feeId: string,
  update: Partial<PeymentTransactrion>
): Promise<PeymentTransactrion | null> {
const updated = await PaymentModel.findOneAndUpdate(
  { studentFeeId: feeId }, 
  {
    $set: {
      status: update.status?.toUpperCase(),
      razorpayPaymentId: update.paymentId,
      paymentDate: update.paidAt || new Date(),
      method: update.method,
      razorpaySignature: update.razorpaySignature,
    },
  },
  { new: true }
);


  return updated ? this.toDomain(updated) : null;
}


async updateinvoiceurl(paymentId: string, invoiceUrl: string): Promise<void> {
    await PaymentModel.findByIdAndUpdate(paymentId,{invoiceUrl})
}

async findById(paymentId: string): Promise<any> {
  return PaymentModel.findById(paymentId)
    .populate("studentId", "fullName studentId")
    .populate({
      path: "studentFeeId",
      model: "FeeStructure",
      select: "name feeItems academicYear classId notes"
    })
    .lean();
}

async getInstitute(): Promise<any> {
  return InstituteModel.findOne().lean();
}


  private toDomain(doc: IPayment): PeymentTransactrion {
    return new PeymentTransactrion(
      doc.id.toString(),
      doc.studentId.toString(),
      doc.studentFeeId.toString(),
      doc.razorpayOrderId || "",
      doc.razorpayPaymentId || null,
      doc.amount,
      this.mapStatusToDomain(doc.status),
      doc.createdAt,
      doc.paymentDate,
      doc.method
    );
  }

  private mapStatusToDb(domainStatus: PeymentTransactrion["status"]): IPayment["status"] {
    switch (domainStatus) {
      case "PENDING": return "PENDING";
      case "PAID": return "PAID";
      case "FAILED": return "FAILED";
      case "REFUNDED": return "REFUNDED";
      default: return "PENDING";
    }
  }

  private mapStatusToDomain(dbStatus: IPayment["status"]): PeymentTransactrion["status"] {
    switch (dbStatus) {
      case "PENDING": return "PENDING";
      case "PAID": return "PAID";
      case "FAILED": return "FAILED";
      case "REFUNDED": return "REFUNDED";
      default: return "PENDING";
    }
  }
}
