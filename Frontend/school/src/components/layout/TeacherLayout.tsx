import { Outlet } from "react-router-dom";
import TeacherSidebar from "../common/Teacher/TeacherSideBar";

export default function TeacherLayout() {
  return (
    <TeacherSidebar>
      <Outlet />
    </TeacherSidebar>
  );
}
