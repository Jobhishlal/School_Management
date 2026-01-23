import { ParentSignupModel } from "../../database/models/ParentSignupModel";
import { ParentEntity } from "../../../domain/entities/Parents";
import { IParentFeeInterface } from "../../../domain/repositories/IParentFeeList";
import { FeeStructureModel } from "../../database/models/FeeManagement/FeeStructure";
import { StudentModel } from "../../database/models/StudentModel";
import { PaymentModel } from "../../database/models/FeeManagement/Payment";


export class ParentRepository implements IParentFeeInterface {

  async findByEmail(email: string): Promise<ParentEntity | null> {
    const parentDoc = await ParentSignupModel.findOne({ email }).exec();
    if (!parentDoc) return null;

    return new ParentEntity(
      parentDoc._id.toString(),
      parentDoc.email,
      parentDoc.password,
      parentDoc.student.toString()
    );
  }

  async findByEmailAndStudentId(email: string, studentId: string): Promise<any> {

    const parentDoc = await ParentSignupModel.findOne({ email })
      .populate("student", "studentId fullName classId")
      .exec();

    if (!parentDoc || !parentDoc.student) return null;

    const student = await StudentModel.findOne({ studentId })
      .populate("classId", "className division")
      .lean();

    if (!student) return null;

    const feeStructures = await FeeStructureModel.find({
      classId: student.classId._id,
    }).sort({ startDate: -1 }).lean();

    const payments = await PaymentModel.find({
      studentId: student._id,
    }).lean();

    const financeWithStatus = feeStructures.map((fee) => {
      // Find all payments for this specific fee
      const feePayments = payments.filter(
        (p) => p.studentFeeId?.toString() === fee._id.toString()
      );

      // Prioritize PAID payment, otherwise take the latest one (assuming insertion order or sort)
      // Safest to sort by creation if needed, but finding PAID is most critical.
      const payment = feePayments.find((p) => p.status === "PAID") || feePayments[feePayments.length - 1];

      const status = payment ? payment.status : "PENDING";

      // Calculate total amount from feeItems
      const baseAmount = (fee as any).feeItems.reduce((acc: number, item: any) => acc + (item.amount || 0), 0);
      let amount = baseAmount;

      let hasPenalty = false;
      let penaltyMessage = "";

      if (status === "PAID") {
        if (payment) {
          amount = payment.amount;
          if (payment.amount > baseAmount) {
            hasPenalty = true;
            penaltyMessage = "Paid with penalty";
          }
        }
      } else if (new Date() > new Date((fee as any).expiryDate)) {
        amount += 200;
        hasPenalty = true;
        penaltyMessage = "You didn't complete this payment before deadline, you have penalty 200 rs";
      }

      return {
        ...fee,
        status: status,
        amount: amount,
        hasPenalty: hasPenalty,
        penaltyMessage: penaltyMessage,
        paymentId: payment?._id || null,
        paymentDate: payment?.createdAt || null,
        transactionId: payment?.razorpayPaymentId || null,
      };
    });


    return {
      parentId: parentDoc._id,
      email: parentDoc.email,
      student: {
        _id: student._id,
        fullName: student.fullName,
        studentId: student.studentId,
        class: student.classId,
        finance: financeWithStatus,
      },
    };
  }
}
