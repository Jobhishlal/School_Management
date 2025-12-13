import { Outlet } from "react-router-dom";
import ParentSidebar from "../common/Parents/ParentsSidebar";


export default function ParentLayout(){
    return(

          <ParentSidebar>
        <Outlet/>
    </ParentSidebar>
    )
   
}