import cron from "node-cron";
import { StudentModel } from "../database/models/StudentModel";
import { FeeStructureModel } from "../database/models/FeeManagement/FeeStructure";
import { StudentFeeModel } from "../database/models/FeeManagement/StudentFee";



cron.schedule("0 0 1 * *", async () => {
  console.log("Monthly fee generation started...");

  try {
    const students = await StudentModel.find();

    for (const student of students) {

      const feeStructure = await FeeStructureModel.findOne({
        classId: student.classId,
      });

      if (!feeStructure) continue;

      const monthlyItems = feeStructure.feeItems.filter(
        (item) => item.frequency === "MONTHLY"
      );

      if (monthlyItems.length === 0) continue;

      const feeItems = monthlyItems.map((item) => ({
        feeTypeId: item.feeTypeId,
        name: item.name,
        amount: item.amount,
        paid: 0,
        pending: item.amount,
        frequency: "MONTHLY",
        isOptional: item.isOptional,
        period: `${new Date().getFullYear()}-${new Date().getMonth() + 1}` // November-2025
      }));

      await StudentFeeModel.create({
        studentId: student._id,
        classId: student.classId,
        academicYear: feeStructure.academicYear, 
        feeStructureId: feeStructure._id,
        items: feeItems,
        totalAmount: feeItems.reduce((a, b) => a + b.amount, 0),
        paidAmount: 0,
        pendingAmount: feeItems.reduce((a, b) => a + b.amount, 0),
        status: "PENDING",
        dueDate: new Date(new Date().setDate(7)), 
        generatedAt: new Date(),
      });

      console.log(`Monthly fee generated for student: ${student.fullName}`);
    }

    console.log("Monthly fee generation completed.");
  } catch (err) {
    console.log("Cron Error:", err);
  }
});
