import api from "../api";
import { API_ROUTES } from "../../constants/routes/Route";

export const StudentProfile = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/student/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res;
};


export const TimeTableview = async (studentId: string) => {
  const res = await api.get("/student/timetable-view", {
    params: { studentId },
  });
  return res.data;
};


export const StudentGetAssignment = async (studentId: string) => {
  try {
    const res = await api.get("/student/assignment-view", {
      params: { studentId },
    });

    
    if (res?.data?.success) {
     
      return Array.isArray(res.data.data) ? res.data.data : [];
    }

    console.warn("No assignments found or unexpected response:", res.data);
    return [];
  } catch (err) {
    console.error("Error fetching assignments:", err);
    return [];
  }
};
