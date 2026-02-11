
import { IStudentPaymentHistorySeeAdmin } from "../../interface/UseCaseInterface/FeeStructure/StudentBasePaymentHistorSee";
import { IFeeStructureRepository } from "../../interface/RepositoryInterface/FeeDetails/IFeeStructureRepository";

export class SearchStudentName implements IStudentPaymentHistorySeeAdmin {
  constructor(private repo: IFeeStructureRepository) {}

  async execute(studentName?: string): Promise<any[]> {
    if (!studentName || studentName.trim() === "") {
        console.log("what was the error",studentName)
      throw new Error("STUDENT_NAME_REQUIRED");
    }

    
    const data =await this.repo.findStudentPaymentStatusByName(studentName);
    console.log(data)
    return data
  }
}
