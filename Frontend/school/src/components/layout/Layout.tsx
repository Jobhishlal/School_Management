import { Outlet } from "react-router-dom";
import SchoolNavbar from "../common/Admin/SideBar";

export default function Layout({ children }: { children?: React.ReactNode }) {
  return <SchoolNavbar>{children || <Outlet />}</SchoolNavbar>;
}

