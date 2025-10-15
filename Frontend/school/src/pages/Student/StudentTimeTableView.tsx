import React, { useEffect, useState } from "react";
import { StudentProfile, TimeTableview } from "../../services/Student/StudentApi";

// Interfaces
interface Period {
  startTime: string;
  endTime: string;
  subject: string;
  teacherId?: string;
}

interface DaySchedule {
  day: string;
  periods: Period[];
}

interface TimeTable {
  classId: {
    _id: string;
    className: string;
    division: string;
  };
  days: DaySchedule[];
}

interface Student {
  _id: string;
  fullName: string;
  classId: string;
  classDetails?: {
    className: string;
    division: string;
  };
}

const StudentTimeTableView: React.FC = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [todaySchedule, setTodaySchedule] = useState<DaySchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileAndTimetable = async () => {
      try {
       
        const profileRes = await StudentProfile();
        const studentApiData = profileRes?.data?.data;

        if (!studentApiData) {
          setError("Student profile not found");
          return;
        }

        const studentData: Student = {
          ...studentApiData,
          _id: studentApiData.id,
        };

        setStudent(studentData);

   
        const timetableRes = await TimeTableview(studentData._id);
        const timetableData: TimeTable = timetableRes?.data;

        if (!timetableRes?.success || !timetableData) {
          setError("Timetable not found for this student");
          return;
        }

        
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const todayIndex = new Date().getDay();
        const today = days[todayIndex];

        const todaySchedule = timetableData.days.find(d => d.day === today) || null;
        setTodaySchedule(todaySchedule);

      } catch (err: any) {
        console.error("Error fetching timetable:", err);
        setError(err?.message || "Failed to fetch timetable");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndTimetable();
  }, []);

  if (loading) return <p>Loading timetable...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!student) return <p>No student profile found.</p>;
  if (!todaySchedule) return <p>No timetable available for today.</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        Timetable for Class {student.classDetails?.className} ({student.classDetails?.division}) - Today
      </h2>

      <div className="mb-4 p-3 border rounded">
        <h3 className="font-semibold mb-2">{todaySchedule.day}</h3>
        {todaySchedule.periods.map((p, i) => (
          <div key={i} className="flex justify-between text-sm border-b py-1">
            <span>{p.startTime} - {p.endTime}</span>
            <span>{p.subject}</span>
            <span className="text-gray-600">{p.teacherId || "No teacher assigned"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentTimeTableView;
