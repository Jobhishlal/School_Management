export interface DashboardData {
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
    Morning: string;
    Afternoon: string;
  };
  calendar: {
    date: string;
    status: string;
  }[];
  logs: {
    date: string;
    session: string;
    status: string;
    remark?: string;
  }[];
}
