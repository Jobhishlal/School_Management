import { StudentFeeRecord } from "../../entities/FeeType/StudentFeeRecord";

export interface IStudentFeeRecordRepository {
  create(record: StudentFeeRecord): Promise<StudentFeeRecord>;
  findById(id: string): Promise<StudentFeeRecord | null>;
  findByStudent(studentId: string): Promise<StudentFeeRecord[]>;
  update(recordId: string, update: Partial<StudentFeeRecord>): Promise<StudentFeeRecord | null>;
}