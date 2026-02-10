import { Router } from "express";
import {
  subAdminController,
  teachercreatecontroller,
  studentcreatecontroller,
  AddressController,
  ClassController,
  institutecontroller,
  subadminprofilemanagecontroller,
  classstudnetmanagecontroller,
  timetablemanagecontroller,
  financemanagementcontroll,
  financetypecontroller,
  expensemanagecontroller,
  expanceapprovalcontroller,
  financeReportController,
  announcementController,
  adminDashboardController
} from "../../infrastructure/di/adminDI";
import { leavemanagecontroller } from "../../infrastructure/di/leaveDI";
import {
  parentManagementController as ParentControllerroute,
  parentPaymentController as paymentController
} from "../../infrastructure/di/parentDI";
import { upload } from "../../infrastructure/middleware/fileUploadService";
import { studentUpload } from "../../infrastructure/middleware/StudentUpload";
import { instituteUpload } from "../../infrastructure/middleware/InstituteProfile";
import { authMiddleware } from "../../infrastructure/middleware/AuthMiddleWare";
import { AuthRequest } from "../../infrastructure/types/AuthRequest";
import { AnnouncementAttachment } from "../../infrastructure/middleware/AnnouncementFile";

const Adminrouter = Router();


// Adminrouter.get("/signup", (req, res) => adminController.getAll(req, res));
// Adminrouter.post("/signuppost", (req, res) => adminController.signupRequest(req, res));
// Adminrouter.post('/verify-otp',(req,res)=>adminController.verifyOtp(req,res))
// Adminrouter.post('/resend-otp',(req,res)=>adminController.resentOtp(req,res))

Adminrouter.get("/admins", (req, res) =>
  subAdminController.getAllSubAdmins(req, res)
);
Adminrouter.post("/adminscreate", (req, res) =>
  subAdminController.createSubAdmin(req, res)
);
Adminrouter.put("/admins/:id", (req, res) =>
  subAdminController.updatesubAdmin(req, res)
);
Adminrouter.put("/admins/:id/block", (req, res) =>
  subAdminController.subadminblock(req, res)
);
Adminrouter.get("/teacher", (req, res) =>
  teachercreatecontroller.getAllTeacher(req, res)
);
Adminrouter.post("/teacher", authMiddleware, upload.array("documents", 5), (req, res) =>
  teachercreatecontroller.createteacher(req as AuthRequest, res)
);
Adminrouter.put("/teacher/:id", authMiddleware, upload.array("documents", 5), (req, res) =>
  teachercreatecontroller.updateTeacher(req as AuthRequest, res)
);
Adminrouter.put("/teacher/:id/block", (req, res) =>
  teachercreatecontroller.blockTeacher(req, res)
);

Adminrouter.get("/parents", (req, res) =>
  ParentControllerroute.getAll(req, res)
);
Adminrouter.post("/parents", (req, res) =>
  ParentControllerroute.create(req, res)
);
Adminrouter.get("/address", (req, res) => AddressController.getAll(req, res));
Adminrouter.post("/address", (req, res) => AddressController.create(req, res));
Adminrouter.get("/class", (req, res) => ClassController.getAll(req, res));
Adminrouter.post("/class", (req, res) => ClassController.create(req, res));
Adminrouter.get("/class/next-division/:className", (req, res) => {
  ClassController.getnextdivision(req, res);
});

Adminrouter.get("/studnets", (req, res) =>
  studentcreatecontroller.getAllStudents(req, res)
);
Adminrouter.post("/students", studentUpload.array("photos", 5), (req, res) =>
  studentcreatecontroller.create(req, res)
);

Adminrouter.put(
  "/students/:id/block",
  studentcreatecontroller.blockStudent.bind(studentcreatecontroller)
);
Adminrouter.put("/students/:id", studentUpload.array("photos", 5), (req, res) =>
  studentcreatecontroller.updateStudent(req, res)
);
Adminrouter.put("/class/:id", (req, res) =>
  ClassController.updateclass(req, res)
);
Adminrouter.put("/parents/:id", (req, res) =>
  ParentControllerroute.updateparents(req, res)
);
Adminrouter.put("/address/:id", (req, res) =>
  AddressController.update(req, res)
);

Adminrouter.post(
  "/instituteprofile",
  instituteUpload.array("logo", 5),
  (req, res) => institutecontroller.createInstitute(req, res)
);
Adminrouter.get("/instituteprofile", (req, res) =>
  institutecontroller.getAll(req, res)
);
Adminrouter.put(
  "/instituteprofile/:id",
  instituteUpload.array("logo", 5),
  (req, res) => institutecontroller.updatProfile(req, res)
);

Adminrouter.get("/adminprofile", authMiddleware, (req, res) => {
  subadminprofilemanagecontroller.getProfile(req as AuthRequest, res);
});

Adminrouter.put(
  "/adminprofile/:id",
  authMiddleware,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "documents", maxCount: 5 },
  ]),
  (req, res) => {
    subadminprofilemanagecontroller.updateProfile(req as AuthRequest, res);
  }
);

Adminrouter.post(
  "/adminprofile/request-password-otp",
  authMiddleware,
  (req, res) => {
    subadminprofilemanagecontroller.RequestPasswor(req as AuthRequest, res);
  }
);

Adminrouter.post(
  "/adminprofile/verify-password-otp",
  authMiddleware,
  (req, res) => {
    subadminprofilemanagecontroller.verifypassword(req as AuthRequest, res);
  }
);

Adminrouter.put(
  "/adminprofile/:id/update-password",
  authMiddleware,
  (req, res) => {
    subadminprofilemanagecontroller.updatePassword(req as AuthRequest, res);
  }
);

Adminrouter.get("/class-division-list", (req, res) => {

  classstudnetmanagecontroller.getClassBasestudent(req, res);
});
Adminrouter.post("/class-assign-teacher", (req, res) =>
  classstudnetmanagecontroller.AssignTeacherOnClass(req, res)
);
Adminrouter.get("/class-teacher/:classId", (req, res) =>
  classstudnetmanagecontroller.ListClassTeacher(req, res)
);

Adminrouter.get("/teacher-list", (req, res) => {

  classstudnetmanagecontroller.GetAllTeachers(req, res);
});


Adminrouter.post('/create-timetable', (req, res) =>
  timetablemanagecontroller.createTimetable(req, res)
)


Adminrouter.get('/timetable-view/:classId/:division', (req, res) =>
  timetablemanagecontroller.GetByClass(req, res)
)

Adminrouter.put('/timetable-update/:id', (req, res) =>
  timetablemanagecontroller.UpdateTimeTable(req, res)
)
Adminrouter.delete('/delete-time-table/:id', (req, res) =>
  timetablemanagecontroller.DeleteTimeTable(req, res)
)


Adminrouter.post('/create-finance', (req, res) =>
  financemanagementcontroll.create(req, res)
)

Adminrouter.post('/create-finance-type', (req, res) =>
  financetypecontroller.create(req, res)
)

Adminrouter.get("/get-allfee-type", (req, res) =>
  financetypecontroller.getAllFeeTypes(req, res)
);

Adminrouter.post('/crete-expense', (req, res) => {
  expensemanagecontroller.create(req, res)
})


Adminrouter.patch(
  "/expense/approve",
  authMiddleware,
  (req, res) => {
    expanceapprovalcontroller.approved(req as AuthRequest, res)
  }
);





Adminrouter.get('/expense/pending',
  authMiddleware,
  (req, res) => {
    expanceapprovalcontroller.getPendingExpenses(req as AuthRequest, res)
  })

Adminrouter.get('/expense/fulllist',
  authMiddleware,
  (req, res) => {
    expensemanagecontroller.listAll(req as AuthRequest, res)
  }
)
Adminrouter.put('/expense/updateexpense/:id',

  authMiddleware,
  (req, res) => {
    expensemanagecontroller.Pendingexpenseupdate(req as AuthRequest, res)
  }
)


Adminrouter.get('/peyment/class/:classId', (req, res) => {
  financemanagementcontroll.fullfeecompletedetails(req, res)
}

)


Adminrouter.get('/finance/searchName', (req, res) => {
  financemanagementcontroll.SearchPeymentHistoryStudent(req, res)
})




Adminrouter.get('/financereport', (req, res) => {
  financeReportController.RevenueGenerateReport(req, res)
})


Adminrouter.get('/expense-report', (req, res) => {
  financeReportController.ExpenseGenarage(req, res)
})

Adminrouter.get('/fee-structures', (req, res) => {
  financemanagementcontroll.getAll(req, res)
})

Adminrouter.get('/payment-history', (req, res) => {
  paymentController.GetPaymentHistory(req, res)
})
Adminrouter.post(
  "/announcement",
  AnnouncementAttachment.single("attachment"),
  (req, res) => {
    announcementController.create(req, res);
  }
);



Adminrouter.put('/update-announcement/:id', AnnouncementAttachment.single("attachment"), (req, res) => {
  announcementController.UpdateAnnouncement(req, res)
})

Adminrouter.get('/announcement/findall', (req, res) => {
  announcementController.FindAllAnnouncement(req, res)
})


Adminrouter.post("/assign-student-class", (req, res) => {
  classstudnetmanagecontroller.StudentDivisionSepareate(req, res)
})

Adminrouter.put('/delete-classordivision/:id', (req, res) => {
  ClassController.deleteClass(req, res)
})


Adminrouter.delete('/delete-announcement/:id', (req, res) => {
  announcementController.delete(req, res)
})



Adminrouter.get('/leave/all-requests',
  authMiddleware,
  (req, res) => leavemanagecontroller.getAllLeaves(req, res)
);

Adminrouter.put('/leave/update-status',
  authMiddleware,
  (req, res) => leavemanagecontroller.updateLeaveStatus(req as AuthRequest, res)
);

Adminrouter.get('/dashboard-stats', authMiddleware, (req, res, next) =>
  adminDashboardController.getDashboard(req, res, next)
);

export default Adminrouter;
