import { Router } from "express";
import { AdminController } from "../http/controllers/ADMIN/AdminController";
import { SignupAdmin } from "../../applications/useCases/Auth/SignupAdmin";
import { GetAdmin } from "../../applications/useCases/admin/GetAdmin";
import { AdminRepository } from "../../infrastructure/repositories/AdminRepository";
import { GenarateOtpP } from "../../applications/useCases/Auth/GenarateOpt";
import { ResendOtp } from "../../applications/useCases/Auth/ResenOtp";
import { CreateSubAdmin } from '../../applications/useCases/admin/CreatetSubAdmin';
import { UpdateDetails } from "../../applications/useCases/admin/UpdateSubAdmin";
import { MongoSubAdminRepo } from '../../infrastructure/repositories/MongoSubAdminRepo';
import { SubAdminCreateController } from '../http/controllers/ADMIN/SupAdmincreateController';
import { SubAdminBlock } from "../../applications/useCases/admin/SubAdminBlock";
import { TeacherCreateController } from "../http/controllers/Teacher/TeachermanageController";
import { TeacherCreateUseCase } from "../../applications/useCases/Teacher/CreateTeacher";
import { MongoTeacher } from "../../infrastructure/repositories/MongoTeacherRepo";
import { UpdateTeacher } from "../../applications/useCases/Teacher/UpdateTeachers";
import { BlockTeacher } from "../../applications/useCases/Teacher/BlockTeacher";
import logger from "../../shared/constants/Logger";
import { upload } from "../../infrastructure/middleware/fileUploadService";
import { studentUpload } from "../../infrastructure/middleware/StudentUpload";
import {StudentCreateController} from '../http/controllers/Student/StudentController'
import { MongoStudentRepo } from "../../infrastructure/repositories/MongoStudentRepo";
import { StudentAddUseCase } from "../../applications/useCases/Students/CreateStudents";
import { ParentManagementCOntroller } from "../http/controllers/ParentController.ts/ParentController";
import { ParentMongoRepository } from "../../infrastructure/repositories/ParentRepository";
import { ParentAddUseCase } from "../../applications/useCases/Parent/ParentUseCase";
import { ParentgetAll } from "../../applications/useCases/Parent/GetAllParents";
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
const repo = new AdminRepository();
const data = new MongoSubAdminRepo();
const value = new MongoTeacher();
const createSubAdminUseCase = new CreateSubAdmin(data);
const updateSubAdminUseCase = new UpdateDetails(data)
const subadminblockUseCase = new SubAdminBlock(data)
const subAdminController = new SubAdminCreateController(createSubAdminUseCase,updateSubAdminUseCase,subadminblockUseCase);

const Adminrouter = Router();

const signupUseCase = new SignupAdmin(repo);
const getAdminUseCase = new GetAdmin(repo);
const generateOtpUseCase = new GenarateOtpP(repo);
const resendOtpUseCase = new ResendOtp();

const adminController = new AdminController(  signupUseCase,  getAdminUseCase,  generateOtpUseCase,  resendOtpUseCase);

const createTeacherUseCase = new TeacherCreateUseCase(value);
const updateTeacherUseCase = new UpdateTeacher(value)
const blockTeacherUseCase = new BlockTeacher(value)
const parentrepo = new ParentMongoRepository()
const teachercreatecontroller = new TeacherCreateController(createTeacherUseCase,updateTeacherUseCase,blockTeacherUseCase)
const studentrepo = new MongoStudentRepo()
const createstudentUseCase = new StudentAddUseCase(studentrepo,parentrepo)
const getliststundetUseCase = new StudentList(studentrepo)
const studentblockuseCase = new StudentBlock(studentrepo)
const updatestudentuseCase = new UpdateStudentUseCase(studentrepo)
const studentcreatecontroller = new StudentCreateController(studentrepo,createstudentUseCase,getliststundetUseCase,studentblockuseCase,updatestudentuseCase)


const createparentrepo = new ParentAddUseCase(parentrepo)
const getallparentrepo = new ParentgetAll(parentrepo)
const updateParentrepo = new UpdateParentUseCase(parentrepo)

const ParentControllerroute = new ParentManagementCOntroller(createparentrepo,getallparentrepo,updateParentrepo)

const addressrepo = new AddressMongoRepository()
const createaddressusecase = new CreatAddressUseCase(addressrepo)
const getalladdressusecase = new AddressGetAll(addressrepo)
const updateaddrressusecase = new AddresUpdateUseCase(addressrepo)
const AddressController = new AddressManagementController(getalladdressusecase,createaddressusecase,updateaddrressusecase)


const classReop = new MongoClassRepository()
const createClass = new CreateClassUseCase(classReop)
const getlistclass = new GetAllClass(classReop)
const classupdateusecase = new UpdateClassUseCase(classReop)
const ClassController = new ClassManagementController(createClass,getlistclass,classupdateusecase)

const instituterepo=new MongoInstituteProfileManage()
const createinstitute = new CreateInstitute(instituterepo)
const institutecontroller = new InstituteProfileController(createinstitute)



Adminrouter.get("/signup", (req, res) => adminController.getAll(req, res));
Adminrouter.post("/signuppost", (req, res) => adminController.signupRequest(req, res));
Adminrouter.post('/verify-otp',(req,res)=>adminController.verifyOtp(req,res))
Adminrouter.post('/resend-otp',(req,res)=>adminController.resentOtp(req,res))

Adminrouter.get('/admins',(req,res)=>subAdminController.getAllSubAdmins(req,res))
Adminrouter.post('/adminscreate',(req,res)=>subAdminController.createSubAdmin(req,res))
Adminrouter.put('/admins/:id', (req,res)=> subAdminController.updatesubAdmin(req,res))
Adminrouter.put('/admins/:id/block',(req,res)=>subAdminController.subadminblock(req,res))
Adminrouter.get('/teacher',(req,res)=>teachercreatecontroller.getAllTeacher(req,res))
Adminrouter.post('/teacher', upload.array("documents", 5),(req,res)=>teachercreatecontroller.createteacher(req,res))
Adminrouter.put('/teacher/:id',upload.array("documents", 5),(req,res)=>teachercreatecontroller.updateTeacher(req,res))
Adminrouter.put('/teacher/:id/block',(req,res)=>teachercreatecontroller.blockTeacher(req,res))



Adminrouter.get("/parents",(req,res)=>ParentControllerroute.getAll(req,res))
Adminrouter.post("/parents",(req,res)=>ParentControllerroute.create(req,res))
Adminrouter.get("/address",(req,res)=>AddressController.getAll(req,res))
Adminrouter.post("/address",(req,res)=>AddressController.create(req,res))
Adminrouter.get("/class",(req,res)=>ClassController.getAll(req,res))
Adminrouter.post("/class",(req,res)=>ClassController.create(req,res))

Adminrouter.get('/studnets',(req,res)=>studentcreatecontroller.getAllStudents(req,res))
Adminrouter.post("/students",studentUpload.array("photos", 5),(req,res)=>studentcreatecontroller.create(req,res))

Adminrouter.put("/students/:id/block", studentcreatecontroller.blockStudent.bind(studentcreatecontroller));
Adminrouter.put("/students/:id",studentUpload.array("photos", 5),(req, res) => studentcreatecontroller.updateStudent(req, res));
Adminrouter.put('/class/:id',(req,res)=>ClassController.updateclass(req,res))
Adminrouter.put('/parents/:id',(req,res)=>ParentControllerroute.updateparents(req,res))
Adminrouter.put('/address/:id',(req,res)=>AddressController.update(req,res))


Adminrouter.post(
  '/instituteprofile',
  instituteUpload.array("logo", 5),
  (req, res) => institutecontroller.createInstitute(req, res)
);


export default Adminrouter;