import React, { useEffect, useState } from "react";
import { fetchTodayAttendanceSummary } from "../../services/authapi";

type AttendanceStatus = "Present" | "Absent" | "Not Marked";

export interface TodayAttendanceItem {
  studentId: string;
  studentName: string;
  Morning?: AttendanceStatus;
  Afternoon?: AttendanceStatus;
}

interface Props {
  classId: string;
}

const TodayAttendanceSummary: React.FC<Props> = ({ classId }) => {
  const [summary, setSummary] = useState<TodayAttendanceItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true);
        const data = await fetchTodayAttendanceSummary(classId);
        console.log("Attendance summary:", data); 
        setSummary(data);
      } catch (error) {
        console.error("Failed to fetch summary", error);
      } finally {
        setLoading(false);
      }
    };

    if (classId) loadSummary();
  }, [classId]);

  if (loading) return <p>Loading attendance summary...</p>;

  return (
    <div className="border rounded-lg p-4 mb-6">
      <h3 className="font-semibold mb-3">Today's Attendance Summary</h3>

      <div className="grid grid-cols-3 font-semibold mb-2">
        <div>Student</div>
        <div>Morning</div>
        <div>Afternoon</div>
      </div>

      {summary.length === 0 ? (
        <p className="text-sm text-gray-500">No attendance marked yet</p>
      ) : (
        summary.map(item => (
          <div
            key={item.studentId}
            className="grid grid-cols-3 py-2 border-b last:border-b-0"
          >
            <div>{item.studentName}</div>
            <div>{item.Morning ?? "Not Marked"}</div>
            <div>{item.Afternoon ?? "Not Marked"}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default TodayAttendanceSummary;
