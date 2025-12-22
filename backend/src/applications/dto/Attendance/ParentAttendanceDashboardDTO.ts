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
    Morning: "Present" | "Absent" | "Not Marked";
    Afternoon: "Present" | "Absent" | "Not Marked";
  };
  calendar: {
    date: string;
    status: "Present" | "Absent";
  }[];
  logs: {
    date: string;
    session: "Morning" | "Afternoon";
    status: "Present" | "Absent";
    remark?: string;
  }[];
}
