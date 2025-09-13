import { Outlet } from "react-router-dom";
import SchoolNavbar from "../common/Admin/SideBar";

export default function Layout() {
  return <SchoolNavbar><Outlet /></SchoolNavbar>;
}

