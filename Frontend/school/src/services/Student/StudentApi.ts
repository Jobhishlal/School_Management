import api from "../api";
import { API_ROUTES } from "../../constants/routes/Route";

export const StudentProfile = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/student/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res;
};
