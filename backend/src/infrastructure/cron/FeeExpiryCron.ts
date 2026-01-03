import cron from "node-cron";
import { FeeStructureModel } from "../database/models/FeeManagement/FeeStructure";
import { StudentModel } from "../database/models/StudentModel";
import { PaymentModel } from "../database/models/FeeManagement/Payment";
import { SendEMail } from "../providers/EmailService";
import { feeExpiredTemplate } from "../../shared/constants/utils/templates/FeeExpiredTemplate";

export const startFeeExpiryCron = () => {
  cron.schedule("0 9 * * *", async () => {
    console.log(" Fee expiry cron started");

    const today = new Date();

    const expiredFeeStructures = await FeeStructureModel.find({
      expiryDate: { $lt: today },
    });

    for (const fee of expiredFeeStructures) {
      const students = await StudentModel
        .find({ classId: fee.classId })
        .populate<{
          parent: {
            _id: string;
            name: string;
            email: string;
          };
        }>("parent");

      for (const student of students) {
        if (!student.parent?.email) continue;

        const paid = await PaymentModel.findOne({
          studentId: student._id,
          status: "PAID",
        });

        if (!paid) {
          await SendEMail(
            student.parent.email,
            "Fee Payment Due Date Over",
            feeExpiredTemplate(
              student.parent.name,
              student.fullName
            )
          );
        }
      }
    }
  });
};
