import { StudentProfilePageview } from "../../applications/useCases/Students/StudentProfileListPage";
import { StudentProfileController } from "../../presentation/http/controllers/Student/StudentProfileController";
import { StudentTimeTableViewUseCase } from "../../applications/useCases/admin/TimeTable/StudentTimetableview";
import { StudentTimetableController } from "../../presentation/http/controllers/Student/StudentTimeTableController";
import { StudentGetAssignment } from "../../applications/useCases/Students/AssignmentView";
import { AssignmentViewStudentsController } from "../../presentation/http/controllers/Student/StudentAssignment";
import { AssignmentSubmit } from "../../applications/useCases/Assignment/StudentAssignmentSubmit";
import { ClassBaseFindAnnouncementUseCase } from "../../applications/useCases/Announcement/AnnouncementFindClassBase";
import { AnnouncementReadController } from "../../presentation/http/controllers/Student/AnnouncementController";
import { Examclassbaseviewusecase } from "../../applications/useCases/Exam/Examclassbaseviewpage";
import { StudentviewExamController } from "../../presentation/http/controllers/Student/StudentExamController";
import { GetStudentExamResultsUseCase } from "../../applications/useCases/Exam/GetStudentExamResultsUseCase";
import { RaiseExamConcernUseCase } from "../../applications/useCases/Exam/RaiseExamConcernUseCase";
import { StudentAttendanceDashboardUseCase } from "../../applications/useCases/Students/StudentAttendanceDashboardUseCase";
import { StudentDateBaseAttendanceSearchUseCase } from "../../applications/useCases/Students/StudentDateBaseAttendanceSearchUseCase";
import { StudentAttendanceController } from "../../presentation/http/controllers/Student/StudentAttendanceController";
import { GetStudentDashboardUseCase } from "../../applications/useCases/StudentDashboard/GetStudentDashboardUseCase";
import { StudentDashboardController } from "../../presentation/http/controllers/Student/StudentDashboardController";

import { MongoStudentRepo } from "../repositories/MongoStudentRepo";
import { MongoTimeTableCreate } from "../repositories/MongoTimeTableCreation";
import { AssignmentMongo } from "../repositories/Assiggment/MongoAssignment";
import { AnnouncementMongo } from "../repositories/Announcement/MongoAnnoucement";
import { ExamMongoRepo } from "../repositories/ExamRepo/ExamMongoRepo";
import { ExamMarkMongoRepository } from "../repositories/ExamRepo/ExamMarkMongoRepo";
import { MongoClassRepository } from "../repositories/MongoClassRepo";
import { AttendanceMongoRepository } from "../repositories/Attendance/AttendanceMongoRepo";
import { SocketNotification } from "../socket/SocketNotification";

// Repositories
const studentRepo = new MongoStudentRepo();
const timetableRepo = new MongoTimeTableCreate();
const assignmentRepo = new AssignmentMongo();
const announcementRepo = new AnnouncementMongo();
const examRepo = new ExamMongoRepo();
const examMarkRepo = new ExamMarkMongoRepository();
const classRepo = new MongoClassRepository();
const attendanceRepo = new AttendanceMongoRepository();

// Services
const socketNotification = new SocketNotification();

// Use Cases
const studentProfilePageView = new StudentProfilePageview(studentRepo);
const studentTimeTableViewUseCase = new StudentTimeTableViewUseCase(timetableRepo);
const studentGetAssignment = new StudentGetAssignment(assignmentRepo);
const assignmentSubmit = new AssignmentSubmit(assignmentRepo);
const classBaseFindAnnouncementUseCase = new ClassBaseFindAnnouncementUseCase(announcementRepo);
const examClassBaseViewUseCase = new Examclassbaseviewusecase(examRepo, studentRepo);
const getStudentExamResultsUseCase = new GetStudentExamResultsUseCase(examRepo, examMarkRepo, studentRepo, classRepo);
const raiseExamConcernUseCase = new RaiseExamConcernUseCase(examMarkRepo);
const studentAttendanceDashboardUseCase = new StudentAttendanceDashboardUseCase(attendanceRepo);
const studentDateBaseAttendanceSearchUseCase = new StudentDateBaseAttendanceSearchUseCase(attendanceRepo);
const getStudentDashboardUseCase = new GetStudentDashboardUseCase(
    timetableRepo,
    attendanceRepo,
    assignmentRepo,
    examRepo,
    announcementRepo,
    studentRepo
);

// Controllers
export const studentProfileController = new StudentProfileController(studentProfilePageView);
export const studentTimetableController = new StudentTimetableController(studentTimeTableViewUseCase);
export const studentAssignmentController = new AssignmentViewStudentsController(studentGetAssignment, assignmentSubmit);
export const studentAnnouncementController = new AnnouncementReadController(
    classBaseFindAnnouncementUseCase,
    studentProfilePageView
);
export const studentExamController = new StudentviewExamController(
    examClassBaseViewUseCase,
    getStudentExamResultsUseCase,
    raiseExamConcernUseCase
);
export const studentAttendanceController = new StudentAttendanceController(
    studentAttendanceDashboardUseCase,
    studentDateBaseAttendanceSearchUseCase
);
export const studentDashboardController = new StudentDashboardController(getStudentDashboardUseCase);
