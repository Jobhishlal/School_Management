import React, { useEffect, useState } from "react";
import { StudentProfile, TimeTableview } from "../../services/Student/StudentApi";

// Interfaces
interface Period {
  startTime: string;
  endTime: string;
  subject: string;
  teacherId?: { name: string };
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
  _id: string; // mapped from backend id
  fullName: string;
  classId: string;
  classDetails?: {
    className: string;
    division: string;
  };
}

const StudentTimeTableView: React.FC = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [timetable, setTimetable] = useState<TimeTable | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileAndTimetable = async () => {
      try {
        // Fetch student profile
        const profileRes = await StudentProfile();
        const studentApiData = profileRes?.data?.data;

        if (!studentApiData) {
          setError("Student profile not found");
          return;
        }

        // Map backend 'id' to frontend '_id'
        const studentData: Student = {
          ...studentApiData,
          _id: studentApiData.id,
        };

        console.log("studentData", studentData);
        setStudent(studentData);

        // Fetch timetable using the mapped _id
        const timetableRes = await TimeTableview(studentData._id);
        console.log("timetable", timetableRes);

        if (!timetableRes?.success || !timetableRes?.data) {
          setError("Timetable not found for this student");
          return;
        }

        setTimetable(timetableRes.data);
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
  if (!timetable) return <p>No timetable available.</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        Timetable for Class {timetable.classId.className} ({timetable.classId.division})
      </h2>

      {timetable.days.map((day) => (
        <div key={day.day} className="mb-4 p-3 border rounded">
          <h3 className="font-semibold mb-2">{day.day}</h3>
          {day.periods.map((p, i) => (
            <div key={i} className="flex justify-between text-sm border-b py-1">
              <span>{p.startTime} - {p.endTime}</span>
              <span>{p.subject}</span>
              <span className="text-gray-600">{p.teacherId?.name || "No teacher assigned"}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default StudentTimeTableView;
