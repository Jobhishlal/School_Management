import { Router } from "express";
import { AdminController } from "../http/controllers/ADMIN/AdminController";
import { SignupAdmin } from "../../applications/useCases/Auth/SignupAdmin";
import { GetAdmin } from "../../applications/useCases/admin/GetAdmin";
import { AdminRepository } from "../../infrastructure/repositories/AdminRepository";
import { GenarateOtpP } from "../../applications/useCases/Auth/GenarateOpt";
import { ResendOtp } from "../../applications/useCases/Auth/ResenOtp";
import { CreateSubAdmin } from "../../applications/useCases/admin/CreatetSubAdmin";
import { UpdateDetails } from "../../applications/useCases/admin/UpdateSubAdmin";
import { MongoSubAdminRepo } from "../../infrastructure/repositories/MongoSubAdminRepo";
import { SubAdminCreateController } from "../http/controllers/ADMIN/SupAdmincreateController";
import { SubAdminBlock } from "../../applications/useCases/admin/SubAdminBlock";
import { TeacherCreateController } from "../http/controllers/Teacher/TeachermanageController";
import { TeacherCreateUseCase } from "../../applications/useCases/Teacher/CreateTeacher";
import { MongoTeacher } from "../../infrastructure/repositories/MongoTeacherRepo";
import { UpdateTeacher } from "../../applications/useCases/Teacher/UpdateTeachers";
import { BlockTeacher } from "../../applications/useCases/Teacher/BlockTeacher";
import { upload } from "../../infrastructure/middleware/fileUploadService";
import { studentUpload } from "../../infrastructure/middleware/StudentUpload";
import { StudentCreateController } from "../http/controllers/Student/StudentController";
import { MongoStudentRepo } from "../../infrastructure/repositories/MongoStudentRepo";
import { StudentAddUseCase } from "../../applications/useCases/Students/CreateStudents";
import { ParentManagementCOntroller } from "../http/controllers/ParentController.ts/ParentController";
import { ParentMongoRepository } from "../../infrastructure/repositories/ParentRepository";
import { ParentAddUseCase } from "../../applications/useCases/Parent/ParentUseCase";
import { GetAllParentsUseCase } from "../../applications/useCases/Parent/GetAllParents";
import { AddressManagementController } from "../http/controllers/Address/AddressManagementController";
import { AddressMongoRepository } from "../../infrastructure/repositories/AddressRepoMongo";
import { AddressGetAll } from "../../applications/useCases/Address/GetAllAddress";
import { CreatAddressUseCase } from "../../applications/useCases/Address/CreateAddress";
import { ClassManagementController } from "../http/controllers/Classroom/ClassController";
import { MongoClassRepository } from "../../infrastructure/repositories/MongoClassRepo";
import { CreateClassUseCase } from "../../applications/useCases/Classdata/CreateClass";
import { GetAllClass } from "../../applications/useCases/Classdata/GeallClass";
import { StudentList } from "../../applications/useCases/Students/GetAllStudents";
import { StudentBlock } from "../../applications/useCases/Students/StudentBlock";
import { UpdateStudentUseCase } from "../../applications/useCases/Students/UpdateStudents";
import { UpdateClassUseCase } from "../../applications/useCases/Classdata/ClassUpdate";
import { UpdateParentUseCase } from "../../applications/useCases/Parent/UpdateParents";
import { AddresUpdateUseCase } from "../../applications/useCases/Address/AddressUpdate";
import { InstituteProfileController } from "../http/controllers/ADMIN/IPRofileController";
import { instituteUpload } from "../../infrastructure/middleware/InstituteProfile";
import { CreateInstitute } from "../../applications/useCases/InstituteProfileManagement/CreateInsti";
import { MongoInstituteProfileManage } from "../../infrastructure/repositories/IMongoInstituteManage";
import { InstituteGetUseCase } from "../../applications/useCases/InstituteProfileManagement/GetInsti";
import { UpdateInstituteProfile } from "../../applications/useCases/InstituteProfileManagement/UpdateInst";
import { SubAdminProfileGetUseCase } from "../../applications/useCases/admin/AdminProfileManagement";
import { SubAdminProfileUpdateUseCase } from "../../applications/useCases/admin/AdminProfileUpdateuseCase";
import { AdminOwnProfileManagement } from "../http/controllers/ADMIN/AdminProfileController";
import { AuthRequest } from "../../infrastructure/types/AuthRequest";
import { authMiddleware } from "../../infrastructure/middleware/AuthMiddleWare";
import { RequestSubAdminPasswordOtpUseCase } from "../../applications/useCases/admin/AdminPasswordChange";
import { VerifySubAdminPasswordOtpUseCase } from "../../applications/useCases/admin/VerifysubadminpasswordOtp";
import { UpdateSubAdminPasswordUseCase } from "../../applications/useCases/admin/UpdatePasswordUseCase";
import { AssignClass } from "../../applications/useCases/Classdata/ClassAssignUseCase";
import { StudentIdGenarateService } from "../../applications/useCases/Students/GenarateStudentId";
import { GenarateTempPassword } from "../../applications/useCases/Students/GenarateTempPass";
import { SendEMailServiceStudent } from "../../applications/useCases/Students/SendStudentRegistrationEmailUseCase";
import { GenaratePasswordSubAdmin } from "../../applications/useCases/admin/GenaratePassword";
import { EmailServiceSubAdmin } from "../../applications/useCases/admin/SendEmailService";
import { SubAdminDuplicate } from "../../applications/useCases/admin/SubadminDuplicate";
import { ClassAndDivision } from "../../applications/useCases/admin/ClassAndDivisionBase";
import { AdminClassController } from "../http/controllers/ADMIN/AdminClassBaseController";
import { ClassDivisionRepository } from "../../infrastructure/repositories/MongoClassDivision";
import { TeacherAssignClassUseCase } from "../../applications/useCases/Classdata/AssignTeacherClassUseCase";
import { GetAssignClassTeacher } from "../../applications/useCases/Classdata/GetAllTeacherClassAssign";
import { GetAllTeachersInClass } from "../../applications/useCases/Classdata/GetAllTeachersinClasses";
import { CreateTimeTable } from "../../applications/useCases/admin/TimeTable/CreateTimeTableUseCase";
import { GetClassbaseTimeTable } from "../../applications/useCases/admin/TimeTable/getClassBaseTimeTable";
import { UpdateTimeTableUseCase } from "../../applications/useCases/admin/TimeTable/UpdateTimeTableUseCase";
import { DeleteTimeTableUseCase } from "../../applications/useCases/admin/TimeTable/DeleteTimeTableUseCase";
import { MongoTimeTableCreate } from "../../infrastructure/repositories/MongoTimeTableCreation";
import { TimeTableManageController } from "../http/controllers/ADMIN/TimeTableMaanageController/TimeTableController";
import { FeeStructureRepository } from "../../infrastructure/repositories/FeeManagement/MongoFeeManagement";
import { CreateFeeStructureUseCase } from "../../applications/useCases/FeeStructure/FeeStructureCreate";
import { FeeTypeManagemnt } from "../../infrastructure/repositories/FeeManagement/MongoFeeTypeManagement";
import { FeeStructureManageController } from "../http/controllers/ADMIN/FeeManagement/FeeManagement";
import { CreateFeeTypeUseCase } from "../../applications/useCases/FeeStructure/FeeTypeCreate";
import { GetFeeTypeAll } from "../../applications/useCases/FeeStructure/FeeTypeGetAll";
import { FeeTypeCreateController } from "../http/controllers/ADMIN/FeeManagement/FeeTypeCreateController";
import { ExpenseManagementController } from "../http/controllers/ADMIN/FeeManagement/ExpanseManagementController";
import { ExpenseCreate } from "../../applications/useCases/FeeStructure/ExpenseCreate";
import { MongoExpenseManagement } from "../../infrastructure/repositories/FeeManagement/MongoExpenseManagement";
import { SuperadminApprovalController } from "../http/controllers/ADMIN/FeeManagement/SuperadminApproveController";
import { ExpenseApproveUseCase } from "../../applications/useCases/FeeStructure/ExpenseApprovalUseCase";
import { PendingStatusFindUsecase } from "../../applications/useCases/FeeStructure/PendingExpenseList";
import { ListOutFullExpense } from "../../applications/useCases/FeeStructure/ListOutFullExpense";
import { StudentPaymentDetailList } from "../../applications/useCases/FeeStructure/StudentFeeCompleteUseCase";

import { PendingStatusUpdateUseCase } from "../../applications/useCases/FeeStructure/PendingstatusUpdateUseCase";
import { SearchStudentName } from "../../applications/useCases/FeeStructure/SearchPaymentHistory";
import { ExpenseReportUseCase } from "../../applications/useCases/FeeStructure/FinanceReport/ExpenseGenerateReportUseCase";
import { MongoExpenseReport } from "../../infrastructure/repositories/FeeManagement/FinanceReport/ExpenseReport";
import { DivisionStudentUseCase } from "../../applications/useCases/Classdata/divisionStudentbaseUsecase";
import { DeleteClassUseCase } from "../../applications/useCases/Classdata/deleteClassUseCase";




//// Revenue Report /////

import { FinanceReportUseCase } from "../../applications/useCases/FeeStructure/FinanceReport/RevenueGenarateFinanceReportUseCase";
import { MongoRevenueGenarateReport } from "../../infrastructure/repositories/FeeManagement/FinanceReport/financeReport";
import { FinanceReportManagementController } from "../http/controllers/ADMIN/FeeManagement/FinanceReport/FinanceReportController";







/// ANNOUNCEMENT 


import { AnnouncementMongo } from "../../infrastructure/repositories/Announcement/MongoAnnoucement";
import { AnnouncementUseCase } from "../../applications/useCases/Announcement/AnnouncementUseCase";
import { AnnouncementController } from "../http/controllers/Announcement/AnnouncementController";
import { SocketNotification } from "../../infrastructure/socket/SocketNotification";
import { AnnouncementAttachment } from "../../infrastructure/middleware/AnnouncementFile";
import { UpdateAnnouncementUseCase } from "../../applications/useCases/Announcement/UpdateAnnouncementUseCase";
import { FindAllAnnoucenemt } from "../../applications/useCases/Announcement/AnnouncementFindUseCase";


import { ParentProfileRepository } from "../../infrastructure/repositories/ParentProfileMongo/ParentProfileMongo";


import { DeleteAnnouncementUseCase } from "../../applications/useCases/Announcement/DeleteAnnouncementUseCase";
import { StudentFindClassBaseUseCase } from "../../applications/useCases/Students/StudentFindClassIDbaseUseCase";

import { PeymentController } from "../http/controllers/Payment/PaymentController";
import { RazorpayServices } from "../../infrastructure/providers/RazorpayService";
import { CreateRazorpayOrder } from "../../applications/useCases/Payment/CreateRazorpayOrder";
import { MongoPeymentRepo } from "../../infrastructure/repositories/FeeManagement/MongoPeymentManagement";
import { VerifyPaymentStatus } from "../../applications/useCases/Payment/VerifyRazorpayPeyment";
import { VerifyPaymentByFeeId } from "../../applications/useCases/Payment/VerifyStatusupdateFeeId";
import { GetPaymentHistory } from "../../applications/useCases/Payment/GetPaymentHistory";
import { GetParentPaymentHistory } from "../../applications/useCases/Payment/GetParentPaymentHistory";
import { DownLoadInvoice } from "../../applications/useCases/Payment/InvoiceSetUP";

const annoucement = new AnnouncementMongo()
const socketNotification = new SocketNotification()
const updateannouncement = new UpdateAnnouncementUseCase(annoucement)
const findall = new FindAllAnnoucenemt(annoucement)
const deleteAnnouncementUseCase = new DeleteAnnouncementUseCase(annoucement)
const announcementcreateusecase = new AnnouncementUseCase(annoucement, socketNotification)
const announcementController = new AnnouncementController(
  announcementcreateusecase,
  updateannouncement,
  findall,
  deleteAnnouncementUseCase
)







const repo = new AdminRepository();
const data = new MongoSubAdminRepo();
const value = new MongoTeacher();
const genaratepasswordsubadmin = new GenaratePasswordSubAdmin();
const emialserviceshare = new EmailServiceSubAdmin();
const subadminduplicate = new SubAdminDuplicate(data);
const createSubAdminUseCase = new CreateSubAdmin(
  data,
  subadminduplicate,
  genaratepasswordsubadmin,
  emialserviceshare
);
const updateSubAdminUseCase = new UpdateDetails(data);
const subadminblockUseCase = new SubAdminBlock(data);
const subAdminController = new SubAdminCreateController(
  createSubAdminUseCase,
  updateSubAdminUseCase,
  subadminblockUseCase
);

const Adminrouter = Router();

// const signupUseCase = new SignupAdmin(repo);
// const getAdminUseCase = new GetAdmin(repo);
// const generateOtpUseCase = new GenarateOtpP(repo);
// const resendOtpUseCase = new ResendOtp();

// const adminController = new AdminController(  signupUseCase,  getAdminUseCase,  generateOtpUseCase,  resendOtpUseCase);

const createTeacherUseCase = new TeacherCreateUseCase(value);
const updateTeacherUseCase = new UpdateTeacher(value);
const blockTeacherUseCase = new BlockTeacher(value);
const parentrepo = new ParentMongoRepository();
const teachercreatecontroller = new TeacherCreateController(
  createTeacherUseCase,
  updateTeacherUseCase,
  blockTeacherUseCase
);
const studentrepo = new MongoStudentRepo();
const emailservice = new SendEMailServiceStudent();
const genaratepassword = new GenarateTempPassword();
const genaratestudentId = new StudentIdGenarateService();
const createstudentUseCase = new StudentAddUseCase(
  studentrepo,
  parentrepo,
  genaratestudentId,
  genaratepassword,
  emailservice
);


const classReop = new MongoClassRepository();
const getliststundetUseCase = new StudentList(studentrepo);
const studentblockuseCase = new StudentBlock(studentrepo);
const updatestudentuseCase = new UpdateStudentUseCase(studentrepo);
const studentfindclassbase = new StudentFindClassBaseUseCase(studentrepo, classReop)
const studentcreatecontroller = new StudentCreateController(
  studentrepo,
  createstudentUseCase,
  getliststundetUseCase,
  studentblockuseCase,
  updatestudentuseCase,
  studentfindclassbase
);


import { GetParentProfileUseCase } from "../../applications/useCases/Parent/GetParentProfileUseCase";

const createparentrepo = new ParentAddUseCase(parentrepo);
const getallparentrepo = new GetAllParentsUseCase(parentrepo);
const updateParentrepo = new UpdateParentUseCase(parentrepo);

const perantprofile = new ParentProfileRepository()
const getParentProfileUseCase = new GetParentProfileUseCase(perantprofile);

const ParentControllerroute = new ParentManagementCOntroller(
  createparentrepo,
  getallparentrepo,
  updateParentrepo,
  getParentProfileUseCase
);

const addressrepo = new AddressMongoRepository();
const createaddressusecase = new CreatAddressUseCase(addressrepo);
const getalladdressusecase = new AddressGetAll(addressrepo);
const updateaddrressusecase = new AddresUpdateUseCase(addressrepo);
const AddressController = new AddressManagementController(
  getalladdressusecase,
  createaddressusecase,
  updateaddrressusecase
);


/// class base all functionality 

const createClass = new CreateClassUseCase(classReop);
const getlistclass = new GetAllClass(classReop);
const classupdateusecase = new UpdateClassUseCase(classReop);
const assignclass = new AssignClass(classReop);
const deleteclassordivision = new DeleteClassUseCase(classReop)
const ClassController = new ClassManagementController(
  createClass,
  getlistclass,
  classupdateusecase,
  assignclass,
  deleteclassordivision
);

const instituterepo = new MongoInstituteProfileManage();
const createinstitute = new CreateInstitute(instituterepo);
const getInstitute = new InstituteGetUseCase(instituterepo);
const updateInstitute = new UpdateInstituteProfile(instituterepo);
const institutecontroller = new InstituteProfileController(
  createinstitute,
  getInstitute,
  updateInstitute
);

const getadminProfile = new SubAdminProfileGetUseCase(data);
const updateadminprofile = new SubAdminProfileUpdateUseCase(data);
const reqestpassword = new RequestSubAdminPasswordOtpUseCase(data);
const updatesubadminpassword = new UpdateSubAdminPasswordUseCase(data);
const verifypassword = new VerifySubAdminPasswordOtpUseCase();

const subadminprofilemanagecontroller = new AdminOwnProfileManagement(
  getadminProfile,
  updateadminprofile,
  reqestpassword,
  updatesubadminpassword,
  verifypassword
);

const classdivisionrepo = new ClassDivisionRepository();

const classdivisionget = new ClassAndDivision(classdivisionrepo);
const ClassTeacherAssign = new TeacherAssignClassUseCase(classdivisionrepo);
const getAllTeachers = new GetAssignClassTeacher(classdivisionrepo);
const getteacherdata = new GetAllTeachersInClass(classdivisionrepo);
const divisionseparatemanually = new DivisionStudentUseCase(classReop)

const classstudnetmanagecontroller = new AdminClassController(
  classdivisionget,
  ClassTeacherAssign,
  getteacherdata,
  getAllTeachers,
  divisionseparatemanually
);

const timetabledata = new MongoTimeTableCreate()
const createtimetable = new CreateTimeTable(timetabledata)
const gettimetabledata = new GetClassbaseTimeTable(timetabledata)
const updatetimetable = new UpdateTimeTableUseCase(timetabledata)
const deletetimetable = new DeleteTimeTableUseCase(timetabledata)
const timetablemanagecontroller = new TimeTableManageController(
  createtimetable,
  gettimetabledata,
  updatetimetable,
  deletetimetable
)

const finance = new FeeStructureRepository()
const financetype = new FeeTypeManagemnt()

const createfinance = new CreateFeeStructureUseCase(finance, financetype, socketNotification)
const createtypeusecase = new CreateFeeTypeUseCase(financetype)
const getallfeetype = new GetFeeTypeAll(financetype)
const searchname = new SearchStudentName(finance)
const studentfeehistory = new StudentPaymentDetailList(finance)
import { GetAllFeeStructures } from "../../applications/useCases/FeeStructure/GetAllFeeStructures";
const getAllFeeStructures = new GetAllFeeStructures(finance);

const financemanagementcontroll = new FeeStructureManageController(
  createfinance,
  studentfeehistory,
  searchname,
  getAllFeeStructures
)

const financetypecontroller = new FeeTypeCreateController(
  createtypeusecase,
  getallfeetype
)

const createexpense = new MongoExpenseManagement()
const expenserepo = new ExpenseCreate(createexpense)
const expensefulllist = new ListOutFullExpense(createexpense)
const pendingstatusupdate = new PendingStatusUpdateUseCase(createexpense)


const expensemanagecontroller = new ExpenseManagementController(
  expenserepo,
  expensefulllist,
  pendingstatusupdate



)


const expenseapprove = new ExpenseApproveUseCase(createexpense)
const pendingexpense = new PendingStatusFindUsecase(createexpense)

const expanceapprovalcontroller = new SuperadminApprovalController(
  expenseapprove,
  pendingexpense,


)

const financereport = new MongoRevenueGenarateReport()
const expensereportmongo = new MongoExpenseReport()
const financeGenarateUsecase = new FinanceReportUseCase(financereport)
const expensereport = new ExpenseReportUseCase(expensereportmongo)




const financeReportController = new FinanceReportManagementController(
  financeGenarateUsecase,
  expensereport

)





const razorpayService = new RazorpayServices();
const paymentRepo = new MongoPeymentRepo();
const paymentSocketNotification = new SocketNotification();
const createRazorpayOrder = new CreateRazorpayOrder(razorpayService, paymentRepo);
const verifyPaymentStatus = new VerifyPaymentStatus(paymentRepo, paymentSocketNotification);
const verifyPaymentByFeeId = new VerifyPaymentByFeeId(paymentRepo);
const downloadInvoice = new DownLoadInvoice(paymentRepo);
const getPaymentHistory = new GetPaymentHistory(paymentRepo);
const getParentPaymentHistory = new GetParentPaymentHistory(paymentRepo);

const paymentController = new PeymentController(
  createRazorpayOrder,
  verifyPaymentStatus,
  verifyPaymentByFeeId,
  downloadInvoice,
  getPaymentHistory,
  getParentPaymentHistory
);


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



import { LeaveManagementController } from "../http/controllers/LeaveManagement/LeaveManageController";
import { LeaveManagementMongoRepo } from "../../infrastructure/repositories/LeaveManagement/MongoLeaveManagement";
import { CreateLeaveUseCase } from "../../applications/useCases/LeavemanagementUseCase.ts/LeaveCreateUseCase";
import { GetTeacherLeavesUseCase } from "../../applications/useCases/LeavemanagementUseCase.ts/GetTeacherLeavesUseCase";
import { GetAllLeavesUseCase } from "../../applications/useCases/LeavemanagementUseCase.ts/GetAllLeavesUseCase";
import { UpdateLeaveStatusUseCase } from "../../applications/useCases/LeavemanagementUseCase.ts/UpdateLeaveStatusUseCase";
import { SubAdminLeaveCreateUseCase } from "../../applications/useCases/LeavemanagementUseCase.ts/SubAdminLeaveCreateUseCase";
import { GetSubAdminLeavesUseCase } from "../../applications/useCases/LeavemanagementUseCase.ts/GetSubAdminLeavesUseCase";

const leaverepo = new LeaveManagementMongoRepo();
const createleave = new CreateLeaveUseCase(leaverepo, value);
const getTeacherLeaves = new GetTeacherLeavesUseCase(leaverepo);
const getAllLeaves = new GetAllLeavesUseCase(leaverepo);
const updateLeaveStatus = new UpdateLeaveStatusUseCase(leaverepo, value, instituterepo, data);
const subAdminLeaveCreate = new SubAdminLeaveCreateUseCase(leaverepo, data);
const getSubAdminLeaves = new GetSubAdminLeavesUseCase(leaverepo);

const leavemanagecontroller = new LeaveManagementController(
  createleave,
  getTeacherLeaves,
  getAllLeaves,
  updateLeaveStatus,
  subAdminLeaveCreate,
  getSubAdminLeaves
);

Adminrouter.get('/leave/all-requests',
  authMiddleware,
  (req, res) => leavemanagecontroller.getAllLeaves(req, res)
);

Adminrouter.put('/leave/update-status',
  authMiddleware,
  (req, res) => leavemanagecontroller.updateLeaveStatus(req as AuthRequest, res)
);


import { AttendanceMongoRepository } from "../../infrastructure/repositories/Attendance/AttendanceMongoRepo";
import { GetAdminDashboardUseCase } from "../../applications/useCases/admin/GetAdminDashboardUseCase";
import { AdminDashboardController } from "../http/controllers/AdminDashboardcontroller/AdminDashboardController";

const attendanceRepo = new AttendanceMongoRepository();
const getAdminDashboardUseCase = new GetAdminDashboardUseCase(
  studentrepo,
  value,
  data,
  classReop,
  annoucement,
  finance,
  paymentRepo,
  createexpense,
  attendanceRepo,
  leaverepo
);
const adminDashboardController = new AdminDashboardController(getAdminDashboardUseCase);

Adminrouter.get('/dashboard-stats', authMiddleware, (req, res, next) =>
  adminDashboardController.getDashboard(req, res, next)
);

export default Adminrouter;
