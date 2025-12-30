export interface CreateTimetableDTO {
  classId: string;
  className: string;
  division: string;
  days: {
    day: string;
    periods: {
      startTime: string;
      endTime: string;
      subject: string;
      teacherId: string;
    }[];
    breaks?: {
      startTime: string;
      endTime: string;
      name?: string;
    }[];
  }[];
}
