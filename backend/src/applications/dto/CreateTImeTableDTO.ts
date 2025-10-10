export interface CreateTimetableDTO {
  classId: string;
  division: string;
  days: {
    day: string;
    periods: {
      startTime: string;
      endTime: string;
      subject: string;
      teacherId: string;
    }[];
  }[];
}
