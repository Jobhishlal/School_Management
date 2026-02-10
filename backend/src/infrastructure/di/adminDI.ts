import { AdminRepository } from "../../infrastructure/repositories/AdminRepository";
import { MongoSubAdminRepo } from "../../infrastructure/repositories/MongoSubAdminRepo";
import { MongoTeacher } from "../../infrastructure/repositories/MongoTeacherRepo";
import { ParentMongoRepository } from "../../infrastructure/repositories/ParentRepository";
import { MongoStudentRepo } from "../../infrastructure/repositories/MongoStudentRepo";
import { AddressMongoRepository } from "../../infrastructure/repositories/AddressRepoMongo";
import { MongoClassRepository } from "../../infrastructure/repositories/MongoClassRepo";
import { MongoInstituteProfileManage } from "../../infrastructure/repositories/IMongoInstituteManage";
import { ClassDivisionRepository } from "../../infrastructure/repositories/MongoClassDivision";
import { MongoTimeTableCreate } from "../../infrastructure/repositories/MongoTimeTableCreation";
import { FeeStructureRepository } from "../../infrastructure/repositories/FeeManagement/MongoFeeManagement";
import { FeeTypeManagemnt } from "../../infrastructure/repositories/FeeManagement/MongoFeeTypeManagement";
import { MongoExpenseManagement } from "../../infrastructure/repositories/FeeManagement/MongoExpenseManagement";
import { MongoRevenueGenarateReport } from "../../infrastructure/repositories/FeeManagement/FinanceReport/financeReport";
import { MongoExpenseReport } from "../../infrastructure/repositories/FeeManagement/FinanceReport/ExpenseReport";
import { AnnouncementMongo } from "../../infrastructure/repositories/Announcement/MongoAnnoucement";
import { MongoPeymentRepo } from "../../infrastructure/repositories/FeeManagement/MongoPeymentManagement";
import { LeaveManagementMongoRepo } from "../../infrastructure/repositories/LeaveManagement/MongoLeaveManagement";
import { AttendanceMongoRepository } from "../../infrastructure/repositories/Attendance/AttendanceMongoRepo";
import { ParentProfileRepository } from "../../infrastructure/repositories/ParentProfileMongo/ParentProfileMongo";

import { SocketNotification } from "../../infrastructure/socket/SocketNotification";

// Use Cases
import { CreateSubAdmin } from "../../applications/useCases/admin/CreatetSubAdmin";
import { UpdateDetails } from "../../applications/useCases/admin/UpdateSubAdmin";
import { SubAdminBlock } from "../../applications/useCases/admin/SubAdminBlock";
import { TeacherCreateUseCase } from "../../applications/useCases/Teacher/CreateTeacher";
import { UpdateTeacher } from "../../applications/useCases/Teacher/UpdateTeachers";
import { BlockTeacher } from "../../applications/useCases/Teacher/BlockTeacher";
import { StudentAddUseCase } from "../../applications/useCases/Students/CreateStudents";
import { StudentList } from "../../applications/useCases/Students/GetAllStudents";
import { StudentBlock } from "../../applications/useCases/Students/StudentBlock";
import { UpdateStudentUseCase } from "../../applications/useCases/Students/UpdateStudents";
import { StudentFindClassBaseUseCase } from "../../applications/useCases/Students/StudentFindClassIDbaseUseCase";
import { CreatAddressUseCase } from "../../applications/useCases/Address/CreateAddress";
import { AddressGetAll } from "../../applications/useCases/Address/GetAllAddress";
import { AddresUpdateUseCase } from "../../applications/useCases/Address/AddressUpdate";
import { CreateClassUseCase } from "../../applications/useCases/Classdata/CreateClass";
import { GetAllClass } from "../../applications/useCases/Classdata/GeallClass";
import { UpdateClassUseCase } from "../../applications/useCases/Classdata/ClassUpdate";
import { AssignClass } from "../../applications/useCases/Classdata/ClassAssignUseCase";
import { DeleteClassUseCase } from "../../applications/useCases/Classdata/deleteClassUseCase";
import { CreateInstitute } from "../../applications/useCases/InstituteProfileManagement/CreateInsti";
import { InstituteGetUseCase } from "../../applications/useCases/InstituteProfileManagement/GetInsti";
import { UpdateInstituteProfile } from "../../applications/useCases/InstituteProfileManagement/UpdateInst";
import { SubAdminProfileGetUseCase } from "../../applications/useCases/admin/AdminProfileManagement";
import { SubAdminProfileUpdateUseCase } from "../../applications/useCases/admin/AdminProfileUpdateuseCase";
import { RequestSubAdminPasswordOtpUseCase } from "../../applications/useCases/admin/AdminPasswordChange";
import { UpdateSubAdminPasswordUseCase } from "../../applications/useCases/admin/UpdatePasswordUseCase";
import { VerifySubAdminPasswordOtpUseCase } from "../../applications/useCases/admin/VerifysubadminpasswordOtp";
import { ClassAndDivision } from "../../applications/useCases/admin/ClassAndDivisionBase";
import { TeacherAssignClassUseCase } from "../../applications/useCases/Classdata/AssignTeacherClassUseCase";
import { GetAssignClassTeacher } from "../../applications/useCases/Classdata/GetAllTeacherClassAssign";
import { GetAllTeachersInClass } from "../../applications/useCases/Classdata/GetAllTeachersinClasses";
import { DivisionStudentUseCase } from "../../applications/useCases/Classdata/divisionStudentbaseUsecase";
import { CreateTimeTable } from "../../applications/useCases/admin/TimeTable/CreateTimeTableUseCase";
import { GetClassbaseTimeTable } from "../../applications/useCases/admin/TimeTable/getClassBaseTimeTable";
import { UpdateTimeTableUseCase } from "../../applications/useCases/admin/TimeTable/UpdateTimeTableUseCase";
import { DeleteTimeTableUseCase } from "../../applications/useCases/admin/TimeTable/DeleteTimeTableUseCase";
import { CreateFeeStructureUseCase } from "../../applications/useCases/FeeStructure/FeeStructureCreate";
import { CreateFeeTypeUseCase } from "../../applications/useCases/FeeStructure/FeeTypeCreate";
import { GetFeeTypeAll } from "../../applications/useCases/FeeStructure/FeeTypeGetAll";
import { SearchStudentName } from "../../applications/useCases/FeeStructure/SearchPaymentHistory";
import { StudentPaymentDetailList } from "../../applications/useCases/FeeStructure/StudentFeeCompleteUseCase";
import { GetAllFeeStructures } from "../../applications/useCases/FeeStructure/GetAllFeeStructures";
import { ExpenseCreate } from "../../applications/useCases/FeeStructure/ExpenseCreate";
import { ListOutFullExpense } from "../../applications/useCases/FeeStructure/ListOutFullExpense";
import { PendingStatusUpdateUseCase } from "../../applications/useCases/FeeStructure/PendingstatusUpdateUseCase";
import { ExpenseApproveUseCase } from "../../applications/useCases/FeeStructure/ExpenseApprovalUseCase";
import { PendingStatusFindUsecase } from "../../applications/useCases/FeeStructure/PendingExpenseList";
import { FinanceReportUseCase } from "../../applications/useCases/FeeStructure/FinanceReport/RevenueGenarateFinanceReportUseCase";
import { ExpenseReportUseCase } from "../../applications/useCases/FeeStructure/FinanceReport/ExpenseGenerateReportUseCase";
import { AnnouncementUseCase } from "../../applications/useCases/Announcement/AnnouncementUseCase";
import { UpdateAnnouncementUseCase } from "../../applications/useCases/Announcement/UpdateAnnouncementUseCase";
import { FindAllAnnoucenemt } from "../../applications/useCases/Announcement/AnnouncementFindUseCase";
import { DeleteAnnouncementUseCase } from "../../applications/useCases/Announcement/DeleteAnnouncementUseCase";
import { GetAdminDashboardUseCase } from "../../applications/useCases/admin/GetAdminDashboardUseCase";

// Services
import { GenaratePasswordSubAdmin } from "../../applications/useCases/admin/GenaratePassword";
import { EmailServiceSubAdmin } from "../../applications/useCases/admin/SendEmailService";
import { SubAdminDuplicate } from "../../applications/useCases/admin/SubadminDuplicate";
import { StudentIdGenarateService } from "../../applications/useCases/Students/GenarateStudentId";
import { GenarateTempPassword } from "../../applications/useCases/Students/GenarateTempPass";
import { SendEMailServiceStudent } from "../../applications/useCases/Students/SendStudentRegistrationEmailUseCase";

// Controllers
import { SubAdminCreateController } from "../../presentation/http/controllers/ADMIN/SupAdmincreateController";
import { TeacherCreateController } from "../../presentation/http/controllers/Teacher/TeachermanageController";
import { StudentCreateController } from "../../presentation/http/controllers/Student/StudentController";
import { AddressManagementController } from "../../presentation/http/controllers/Address/AddressManagementController";
import { ClassManagementController } from "../../presentation/http/controllers/Classroom/ClassController";
import { InstituteProfileController } from "../../presentation/http/controllers/ADMIN/IPRofileController";
import { AdminOwnProfileManagement } from "../../presentation/http/controllers/ADMIN/AdminProfileController";
import { AdminClassController } from "../../presentation/http/controllers/ADMIN/AdminClassBaseController";
import { TimeTableManageController } from "../../presentation/http/controllers/ADMIN/TimeTableMaanageController/TimeTableController";
import { FeeStructureManageController } from "../../presentation/http/controllers/ADMIN/FeeManagement/FeeManagement";
import { FeeTypeCreateController } from "../../presentation/http/controllers/ADMIN/FeeManagement/FeeTypeCreateController";
import { ExpenseManagementController } from "../../presentation/http/controllers/ADMIN/FeeManagement/ExpanseManagementController";
import { SuperadminApprovalController } from "../../presentation/http/controllers/ADMIN/FeeManagement/SuperadminApproveController";
import { FinanceReportManagementController } from "../../presentation/http/controllers/ADMIN/FeeManagement/FinanceReport/FinanceReportController";
import { AnnouncementController } from "../../presentation/http/controllers/Announcement/AnnouncementController";
import { AdminDashboardController } from "../../presentation/http/controllers/AdminDashboardcontroller/AdminDashboardController";

// Instantiation

// Common Repositories & Services
const adminRepo = new AdminRepository();
const subAdminRepo = new MongoSubAdminRepo();
const teacherRepo = new MongoTeacher();
const parentRepo = new ParentMongoRepository();
const studentRepo = new MongoStudentRepo();
const addressRepo = new AddressMongoRepository();
const classRepo = new MongoClassRepository();
const instituteRepo = new MongoInstituteProfileManage();
const classDivisionRepo = new ClassDivisionRepository();
const timeTableRepo = new MongoTimeTableCreate();
const feeStructureRepo = new FeeStructureRepository();
const feeTypeRepo = new FeeTypeManagemnt();
const expenseRepo = new MongoExpenseManagement();
const financeReportRepo = new MongoRevenueGenarateReport();
const expenseReportRepo = new MongoExpenseReport();
const announcementRepo = new AnnouncementMongo();
const paymentRepo = new MongoPeymentRepo();
const leaveRepo = new LeaveManagementMongoRepo();
const attendanceRepo = new AttendanceMongoRepository();
const parentProfileRepo = new ParentProfileRepository();

const socketNotification = new SocketNotification();

// SubAdmin
const genaratePasswordSubAdmin = new GenaratePasswordSubAdmin();
const emailServiceSubAdmin = new EmailServiceSubAdmin();
const subAdminDuplicate = new SubAdminDuplicate(subAdminRepo);
const createSubAdminUseCase = new CreateSubAdmin(subAdminRepo, subAdminDuplicate, genaratePasswordSubAdmin, emailServiceSubAdmin);
const updateSubAdminUseCase = new UpdateDetails(subAdminRepo);
const subAdminBlockUseCase = new SubAdminBlock(subAdminRepo);
export const subAdminController = new SubAdminCreateController(createSubAdminUseCase, updateSubAdminUseCase, subAdminBlockUseCase);

// Teacher
const createTeacherUseCase = new TeacherCreateUseCase(teacherRepo);
const updateTeacherUseCase = new UpdateTeacher(teacherRepo);
const blockTeacherUseCase = new BlockTeacher(teacherRepo);
export const teachercreatecontroller = new TeacherCreateController(createTeacherUseCase, updateTeacherUseCase, blockTeacherUseCase);

// Student
const genarateStudentId = new StudentIdGenarateService();
const genarateTempPassword = new GenarateTempPassword();
const sendEmailServiceStudent = new SendEMailServiceStudent();
const createStudentUseCase = new StudentAddUseCase(studentRepo, parentRepo, genarateStudentId, genarateTempPassword, sendEmailServiceStudent);
const studentListUseCase = new StudentList(studentRepo);
const studentBlockUseCase = new StudentBlock(studentRepo);
const updateStudentUseCase = new UpdateStudentUseCase(studentRepo);
const studentFindClassBase = new StudentFindClassBaseUseCase(studentRepo, classRepo);
export const studentcreatecontroller = new StudentCreateController(studentRepo, createStudentUseCase, studentListUseCase, studentBlockUseCase, updateStudentUseCase, studentFindClassBase);

// Address
const createAddressUseCase = new CreatAddressUseCase(addressRepo);
const getAllAddressUseCase = new AddressGetAll(addressRepo);
const updateAddressUseCase = new AddresUpdateUseCase(addressRepo);
export const AddressController = new AddressManagementController(getAllAddressUseCase, createAddressUseCase, updateAddressUseCase);

// Class
const createClassUseCase = new CreateClassUseCase(classRepo);
const getAllClassUseCase = new GetAllClass(classRepo);
const updateClassUseCase = new UpdateClassUseCase(classRepo);
const assignClassUseCase = new AssignClass(classRepo);
const deleteClassUseCase = new DeleteClassUseCase(classRepo);
export const ClassController = new ClassManagementController(createClassUseCase, getAllClassUseCase, updateClassUseCase, assignClassUseCase, deleteClassUseCase);

// Institute
const createInstituteUseCase = new CreateInstitute(instituteRepo);
const getInstituteUseCase = new InstituteGetUseCase(instituteRepo);
const updateInstituteUseCase = new UpdateInstituteProfile(instituteRepo);
export const institutecontroller = new InstituteProfileController(createInstituteUseCase, getInstituteUseCase, updateInstituteUseCase);

// Admin Profile
const getAdminProfileUseCase = new SubAdminProfileGetUseCase(subAdminRepo);
const updateAdminProfileUseCase = new SubAdminProfileUpdateUseCase(subAdminRepo);
const requestPasswordUseCase = new RequestSubAdminPasswordOtpUseCase(subAdminRepo);
const updateSubAdminPasswordUseCase = new UpdateSubAdminPasswordUseCase(subAdminRepo);
const verifyPasswordUseCase = new VerifySubAdminPasswordOtpUseCase();
export const subadminprofilemanagecontroller = new AdminOwnProfileManagement(getAdminProfileUseCase, updateAdminProfileUseCase, requestPasswordUseCase, updateSubAdminPasswordUseCase, verifyPasswordUseCase);

// Class Student Manage
const classDivisionGet = new ClassAndDivision(classDivisionRepo);
const teacherAssignClassUseCase = new TeacherAssignClassUseCase(classDivisionRepo);
const getAllTeachers = new GetAssignClassTeacher(classDivisionRepo);
const getTeacherData = new GetAllTeachersInClass(classDivisionRepo);
const divisionStudentUseCase = new DivisionStudentUseCase(classRepo);
export const classstudnetmanagecontroller = new AdminClassController(classDivisionGet, teacherAssignClassUseCase, getTeacherData, getAllTeachers, divisionStudentUseCase);

// TimeTable
const createTimeTableUseCase = new CreateTimeTable(timeTableRepo);
const getTimeTableUseCase = new GetClassbaseTimeTable(timeTableRepo);
const updateTimeTableUseCase = new UpdateTimeTableUseCase(timeTableRepo);
const deleteTimeTableUseCase = new DeleteTimeTableUseCase(timeTableRepo);
export const timetablemanagecontroller = new TimeTableManageController(createTimeTableUseCase, getTimeTableUseCase, updateTimeTableUseCase, deleteTimeTableUseCase);

// Finance / Fee
const createFeeStructureUseCase = new CreateFeeStructureUseCase(feeStructureRepo, feeTypeRepo, socketNotification);
const searchStudentName = new SearchStudentName(feeStructureRepo);
const studentPaymentDetailList = new StudentPaymentDetailList(feeStructureRepo);
const getAllFeeStructures = new GetAllFeeStructures(feeStructureRepo);
export const financemanagementcontroll = new FeeStructureManageController(createFeeStructureUseCase, studentPaymentDetailList, searchStudentName, getAllFeeStructures);

const createFeeTypeUseCase = new CreateFeeTypeUseCase(feeTypeRepo);
const getFeeTypeAll = new GetFeeTypeAll(feeTypeRepo);
export const financetypecontroller = new FeeTypeCreateController(createFeeTypeUseCase, getFeeTypeAll);

// Expense
const expenseCreateUseCase = new ExpenseCreate(expenseRepo);
const expenseListUseCase = new ListOutFullExpense(expenseRepo);
const pendingStatusUpdateUseCase = new PendingStatusUpdateUseCase(expenseRepo);
export const expensemanagecontroller = new ExpenseManagementController(expenseCreateUseCase, expenseListUseCase, pendingStatusUpdateUseCase);

const expenseApproveUseCase = new ExpenseApproveUseCase(expenseRepo);
const pendingExpenseUseCase = new PendingStatusFindUsecase(expenseRepo);
export const expanceapprovalcontroller = new SuperadminApprovalController(expenseApproveUseCase, pendingExpenseUseCase);

// Finance Report
const financeReportUseCase = new FinanceReportUseCase(financeReportRepo);
const expenseReportUseCase = new ExpenseReportUseCase(expenseReportRepo);
export const financeReportController = new FinanceReportManagementController(financeReportUseCase, expenseReportUseCase);

// Announcement
const updateAnnouncementUseCase = new UpdateAnnouncementUseCase(announcementRepo);
const findAllAnnouncement = new FindAllAnnoucenemt(announcementRepo);
const deleteAnnouncementUseCase = new DeleteAnnouncementUseCase(announcementRepo);
const announcementCreateUseCase = new AnnouncementUseCase(announcementRepo, socketNotification);
export const announcementController = new AnnouncementController(announcementCreateUseCase, updateAnnouncementUseCase, findAllAnnouncement, deleteAnnouncementUseCase);

// Dashboard
const getAdminDashboardUseCase = new GetAdminDashboardUseCase(studentRepo, teacherRepo, subAdminRepo, classRepo, announcementRepo, feeStructureRepo, paymentRepo, expenseRepo, attendanceRepo, leaveRepo);
export const adminDashboardController = new AdminDashboardController(getAdminDashboardUseCase);
