
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { SendEMail } from "./EmailService";
// import {  genarateotptoken,  verifiedOtptoken,  decodedOtptoken } from "../security/otpJwtService";
// import { GenarateOtp } from "../../shared/constants/utils/Otpgenarator";
// import { AdminSubAdminCompaign } from "../repositories/AdminAndSubAdminLogin";
// import { IUnifiedAuthService } from "../../domain/repositories/IUnifiedAuthService";
// import { OtpError } from "../../domain/enums/OtpErrorMessage";
// import { AdminError } from "../../domain/enums/Adminsinguperror";
// import { MongoTeacher } from "../repositories/MongoTeacherRepo";
// import logger from "../../shared/constants/Logger";
// import { MongoStudentRepo } from "../repositories/MongoStudentRepo";
// import { MongoParentSignUp } from "../repositories/MongoSignupParents";

// const MAIN_ADMIN_EMAIL = process.env.MAIN_ADMIN_EMAIL!;
// const MAIN_ADMIN_PASS = process.env.MAIN_ADMIN_PASSWORD_HASH!;
// const JWT_SECRET = process.env.JWT_SECRET || "super-secret";

// export class UnifiedAdminAuthService implements IUnifiedAuthService {
//   private subadminRepo = new AdminSubAdminCompaign();
//   private teacherRepo =new MongoTeacher()
//   private studentRepo = new MongoStudentRepo()
//   private parentRepo = new MongoParentSignUp();



// async login( email: string, password: string,studentId?:string):  Promise<
//   | { otpToken: string; role: "super_admin" | "sub_admin" | "Teacher" }
//   | { authToken: string; role: "Students" }
// >  {

//       if (studentId) {
//     const student = await this.studentRepo.findStudentid(studentId);
//     if (!student) throw new Error(AdminError.UserDoesNotExist);

//     const passwordValid = await bcrypt.compare(password!, student.Password);
//     if (!passwordValid) throw new Error(AdminError.UserDoesNotExist);
//     if (student.blocked) throw new Error("Student is blocked");

//     const role: "Students" = "Students";
//     const authToken = jwt.sign(
//       { studentId: student.studentId, role, id: student.id },
//       JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     return { authToken, role };
//   }
//     if (email && email.trim() === MAIN_ADMIN_EMAIL) {
//     const isMatch = await bcrypt.compare(password, MAIN_ADMIN_PASS);

//     if (!isMatch) throw new Error(AdminError.UserDoesNotExist);

//     const otp = GenarateOtp(6);
//     await SendEMail(email, "Super Admin OTP", `Your OTP is: ${otp}`);
//     const otpToken = genarateotptoken(email, otp, { role: "super_admin" });

//     return { otpToken, role: "super_admin" };
//   }

  


// const teacher = await this.teacherRepo.findByEmail(email);


// if (!teacher) {
//   logger.info("Teacher not found in DB");
// }

// if (teacher && teacher.role === "Teacher") {
//   logger.info("Teacher role matches");
//   logger.info(`Raw password: ${password}`);
//   logger.info(`Stored hash: ${teacher.Password}`);

//   const passwordValid = await bcrypt.compare(password, teacher.Password);
//   logger.info("Password valid?", passwordValid);

//   if (!passwordValid) {
//     throw new Error("Invalid Teacher Credentials");
//   }

//   if (teacher.blocked) throw new Error("teacher blocked");

//   const otp = GenarateOtp(6);
//   await SendEMail(email, "Teacher OTP", `Your OTP is: ${otp}`);
//   const otpToken = genarateotptoken(email, otp, { role: "Teacher", id: teacher.id });
//   return { otpToken, role: "Teacher" };
// }


//   const subadmin = await this.subadminRepo.findByEmail(email);
//   if (subadmin && subadmin.major_role === "sub_admin") {
//     const isPasswordValid = await bcrypt.compare(password, subadmin.password);
//     if (!isPasswordValid) throw new Error(AdminError.UserDoesNotExist);

//        if(subadmin.blocked){
//        throw new Error("subadmin blocked")
//        }


//     const otp = GenarateOtp(6);
//     await SendEMail(email, "Sub Admin OTP", `Your OTP is: ${otp}`);
//     const otpToken = genarateotptoken(email, otp, {
//       role: "sub_admin",
//       id: subadmin._id,
//     });

//     return { otpToken, role: "sub_admin" };
//   }

//    if (email && !studentId) {
//   const parent = await this.parentRepo.findByEmail(email);

//   if (parent) {
    
//     const passwordValid = await bcrypt.compare(password, parent.password);
//     if (!passwordValid) throw new Error("Invalid Parent Credentials");

    
//     const role: "Parent" = "Parent";
//     const authToken = jwt.sign(
//       { email: parent.email, role, id: parent.id },
//       JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     return { authToken, role };
//   }
// }

// logger.info("Reached end of login: throwing UserDoesNotExist");
// throw new Error(AdminError.UserDoesNotExist);

  


// }



// async verifyOtp(  otpToken: string,  otp: string): Promise<{ authToken: string; role: "super_admin" | "sub_admin" | "Teacher"}> {
//   const decoded = verifiedOtptoken(otpToken);
//   if (!decoded) throw new Error(OtpError.OTP_ERROR);
//   if (decoded.otp !== otp) {
//     throw new Error(OtpError.INVALID_OTP);
//   }

//   const role = decoded.role as "super_admin" | "sub_admin" | "Teacher";

//   const authToken = jwt.sign(
//     { email: decoded.email, role, id: decoded.id },
//     JWT_SECRET,
//     { expiresIn: "1d" }
//   );

//   return { authToken, role };
// }


//  async resendOtp(oldOtpToken: string): Promise<{ otpToken: string }> {
//   const decoded = decodedOtptoken(oldOtpToken);
//   if (!decoded || !decoded.email) {
//     throw new Error(OtpError.INVALID_OTP);
//   }

//   const newOtp = GenarateOtp(6);
//   await SendEMail(decoded.email, "Resend OTP", `Your new OTP is: ${newOtp}`);

//   const newOtpToken = genarateotptoken(decoded.email, newOtp, {
//     role: decoded.role,
//     id: decoded.id,
//   });

//   return { otpToken: newOtpToken };
// }


// }



















import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SendEMail } from "./EmailService";
import { genarateotptoken, verifiedOtptoken, decodedOtptoken } from "../security/otpJwtService";
import { GenarateOtp } from "../../shared/constants/utils/Otpgenarator";
import { AdminSubAdminCompaign } from "../repositories/AdminAndSubAdminLogin";
import { IUnifiedAuthService } from "../../domain/repositories/IUnifiedAuthService";
import { OtpError } from "../../domain/enums/OtpErrorMessage";
import { AdminError } from "../../domain/enums/Adminsinguperror";
import { MongoTeacher } from "../repositories/MongoTeacherRepo";
import logger from "../../shared/constants/Logger";
import { MongoStudentRepo } from "../repositories/MongoStudentRepo";
import { ParentAuthRepository } from "../repositories/ParentAuthRepository";

const MAIN_ADMIN_EMAIL = process.env.MAIN_ADMIN_EMAIL!;
const MAIN_ADMIN_PASS = process.env.MAIN_ADMIN_PASSWORD_HASH!;
const JWT_SECRET = process.env.JWT_SECRET || "super-secret";

export class UnifiedAdminAuthService implements IUnifiedAuthService {
  private subadminRepo = new AdminSubAdminCompaign();
  private teacherRepo = new MongoTeacher();
  private studentRepo = new MongoStudentRepo();
  private parentRepo = new ParentAuthRepository();

  async login(
    email?: string,
    password?: string,
    studentId?: string
  ): Promise<
    | { otpToken: string; role: "super_admin" | "sub_admin" | "Teacher" }
    | { authToken: string; role: "Students" | "Parent" }
  > {
    console.log("reached login")

              // ---------------- Parent Login ----------------
if (email && studentId) {
  console.log("parent reached")
  const parent = await this.parentRepo.findByEmailAndStudentId(email,studentId);

  if (!parent) {
    throw new Error("Parent does not exist");
  }

  if (parent.student.studentId !== studentId) {
    throw new Error("Student ID does not match the parent");
  }

  
  const passwordValid = await bcrypt.compare(password!, parent.password);
  if (!passwordValid) throw new Error("Invalid Parent Credentials");

  const role: "Parent" = "Parent";
  const authToken = jwt.sign(
    { email: parent.email, role, id: parent.id, studentId: parent.studentId },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { authToken, role };
}
    // ---------------- Student Login ----------------
    if (studentId) {

      const student = await this.studentRepo.findStudentid(studentId);
      if (!student) throw new Error(AdminError.UserDoesNotExist);

      const passwordValid = await bcrypt.compare(password!, student.Password);
      if (!passwordValid) throw new Error(AdminError.UserDoesNotExist);
      if (student.blocked) throw new Error("Student is blocked");

      const role: "Students" = "Students";
      const authToken = jwt.sign({ studentId: student.studentId, role, id: student.id }, JWT_SECRET, { expiresIn: "1d" });

      return { authToken, role };
    }

    // ---------------- Super Admin Login ----------------
    if (email && email.trim() === MAIN_ADMIN_EMAIL) {
      const isMatch = await bcrypt.compare(password!, MAIN_ADMIN_PASS);
      if (!isMatch) throw new Error(AdminError.UserDoesNotExist);

      const otp = GenarateOtp(6);
      await SendEMail(email, "Super Admin OTP", `Your OTP is: ${otp}`);

      const otpToken = genarateotptoken(email, otp, { role: "super_admin", id: "main_admin" });
      return { otpToken, role: "super_admin" };
    }

    // ---------------- Teacher Login ----------------
      if (email) {
      const teacher = await this.teacherRepo.findByEmail(email);
      if (teacher && teacher.role === "Teacher") {
        const passwordValid = await bcrypt.compare(password!, teacher.Password);
        if (!passwordValid) throw new Error("Invalid Teacher Credentials");
        if (teacher.blocked) throw new Error("Teacher is blocked");

        const otp = GenarateOtp(6);
        await SendEMail(email, "Teacher OTP", `Your OTP is: ${otp}`);

        const otpToken = genarateotptoken(email, otp, { role: "Teacher", id: teacher.id });
        return { otpToken, role: "Teacher" };
      }
    }

    // ---------------- Sub-admin Login ----------------
  if (email) {
      const subadmin = await this.subadminRepo.findByEmail(email);
      if (subadmin && subadmin.major_role === "sub_admin") {
        const isPasswordValid = await bcrypt.compare(password!, subadmin.password);
        if (!isPasswordValid) throw new Error("Invalid Credentials");

        const otp = GenarateOtp(6);
        await SendEMail(email, "Sub Admin OTP", `Your OTP is: ${otp}`);

        const otpToken = genarateotptoken(email, otp, { role: "sub_admin", id: subadmin._id });
        return { otpToken, role: "sub_admin" };
      }
    }

    console.log("Reached end of login: throwing UserDoesNotExist");
    throw new Error(AdminError.UserDoesNotExist);
  }

 async verifyOtp(otpToken: string, otp: string): Promise<{ authToken: string; role: "super_admin" | "sub_admin" | "Teacher", id: string, email: string }> { 
    const decoded = verifiedOtptoken(otpToken);
    if (!decoded) throw new Error(OtpError.OTP_ERROR);
    if (decoded.otp !== otp) throw new Error(OtpError.INVALID_OTP);
    if (!decoded.id || !decoded.email) throw new Error("User identity missing from OTP token"); // Safety check

    const role = decoded.role as "super_admin" | "sub_admin" | "Teacher";
    const authToken = jwt.sign({ email: decoded.email, role, id: decoded.id }, JWT_SECRET, { expiresIn: "1d" });
    console.log("auth token",authToken)
    return { authToken, role, id: decoded.id, email: decoded.email }; 
}




  async resendOtp(oldOtpToken: string): Promise<{ otpToken: string }> {
    const decoded = decodedOtptoken(oldOtpToken);
    if (!decoded || !decoded.email) throw new Error(OtpError.INVALID_OTP);

    const newOtp = GenarateOtp(6);
    await SendEMail(decoded.email, "Resend OTP", `Your new OTP is: ${newOtp}`);
    const newOtpToken = genarateotptoken(decoded.email, newOtp, { role: decoded.role, id: decoded.id });
    return { otpToken: newOtpToken };
  }
}
