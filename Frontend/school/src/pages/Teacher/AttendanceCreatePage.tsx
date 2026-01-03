import React, { useEffect, useState } from "react";
import {
  GetStudentsByTeacher,
 
} from "../../services/authapi";
import TodayAttendanceSummary from "./TodayAttendanceSummary";
import TakeAttendanceForm from "./AttendanceCreate";
import { getDecodedToken } from "../../utils/DecodeToken";
import type{ TodayAttendanceItem } from "./TodayAttendanceSummary";

const AttendanceCreatePage = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [summary, setSummary] = useState<TodayAttendanceItem[]>([]);
  const [session, setSession] = useState<"Morning" | "Afternoon" | null>(null);

  const teacherId = getDecodedToken()?.id;

  const getCurrentSession = (): "Morning" | "Afternoon" | null => {
    const hour = new Date().getHours();
    if (hour >= 8 && hour < 12) return "Morning";
    if (hour >= 12 && hour < 24) return "Afternoon";
    return null;
  };

  const loadSummary = async (classId: string) => {
    const res = await fetchTodayAttendanceSummary(classId);
    console.log("res",res)
    setSummary(res.attendance?.attendance || []);
  };

  useEffect(() => {
    const init = async () => {
      const detectedSession = getCurrentSession();
      setSession(detectedSession);

      const res = await GetStudentsByTeacher();
      setStudents(res.students);

      if (res.students.length > 0) {
        loadSummary(res.students[0].classId);
      }
    };

    init();
  }, []);

 return (
  <div className="p-6 max-w-4xl mx-auto">
    <h2 className="text-xl font-bold mb-4">Attendance</h2>

 

    {session && teacherId && students.length > 0 && (
      <TakeAttendanceForm
        students={students}
        teacherId={teacherId}
        session={session}
        onSuccess={() => loadSummary(students[0].classId)}
      />
      
    )}
    <div >

         {students.length > 0 && (
      <TodayAttendanceSummary classId={students[0].classId} />
    )}
    </div>
      
  </div>
);

};

export default AttendanceCreatePage;
