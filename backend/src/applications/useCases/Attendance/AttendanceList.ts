import { IAttendanceList } from "../../interface/UseCaseInterface/Attandance/IAttendanceTeacherList";
import { IAttandanceRepository } from "../../../domain/repositories/Attandance/IAttendanceRepository";
import { TodayAttendanceResponse, TodayAttendanceItemDTO } from "../../dto/Attendance/TodayAttendanceDTO";

export class AttendanceListUseCase implements IAttendanceList {
  constructor(private repo: IAttandanceRepository) { }

  async execute(classId: string, status?: string): Promise<TodayAttendanceResponse> {
    const attendanceData = await this.repo.getTodayAttendanceByClass(classId, status);

    if (!attendanceData || attendanceData.length === 0) {
      return { date: new Date(), totalStudents: 0, attendance: [] };
    }

    const attendanceList: TodayAttendanceItemDTO[] = attendanceData.map(a => {
      return {
        studentId: a.studentId,
        studentName: a.studentName,
        Morning: a.Morning ?? "Not Marked",
        Afternoon: a.Afternoon ?? "Not Marked",
      };
    });

    return {
      date: new Date(),
      totalStudents: attendanceList.length,
      attendance: attendanceList,
    };
  }
}
