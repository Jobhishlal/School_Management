import { Outlet } from "react-router-dom";
import StudentSidebar from "../common/Student/StudentSideBar";

export default function StudentLayout(){
    return <StudentSidebar>
        <Outlet/>
    </StudentSidebar>
}