export interface ParentAttendanceDashboardDTO {
  student: {
    id: string;
    name: string;
    photo?: string;
    classId: string;
  };
  summary: {
    totalClasses: number;
    present: number;
    absent: number;
    leave: number;
    percentage: number;
  };
  today: {
    Morning:  "Present" | "Absent" | "Leave";
    Afternoon: "Present" | "Absent" | "Leave";
  };
  calendar: {
    date: string;
    status: "Present" | "Absent" | "Leave";
  }[];
  logs: {
    date: string;
    session: "Morning" | "Afternoon";
    status: "Present" | "Absent";
    remark?: string;
  }[];
}
