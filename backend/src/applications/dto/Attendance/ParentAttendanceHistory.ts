export interface AttendanceHistoryItem {
  date: string;
  session: "Morning" | "Afternoon";
  status: "Present" | "Absent" | "Leave" | "Not Marked";
  remarks?: string;
}

export interface ParentAttendanceHistory {
  student: {
    id: string;
    name: string;
    classId: string;
    photo?: string;
  };
  summary: {
    totalClasses: number;
    present: number;
    absent: number;
    percentage: number;
  };
  logs: AttendanceHistoryItem[];
}
