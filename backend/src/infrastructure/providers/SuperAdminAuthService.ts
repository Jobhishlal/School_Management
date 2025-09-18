
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SendEMail } from "./EmailService";
import {  genarateotptoken,  verifiedOtptoken,  decodedOtptoken } from "../security/otpJwtService";
import { GenarateOtp } from "../../shared/constants/utils/Otpgenarator";
import { AdminSubAdminCompaign } from "../repositories/AdminAndSubAdminLogin";
import { IUnifiedAuthService } from "../../domain/repositories/IUnifiedAuthService";
import { OtpError } from "../../domain/enums/OtpErrorMessage";
import { AdminError } from "../../domain/enums/Adminsinguperror";
import { MongoTeacher } from "../repositories/MongoTeacherRepo";
import logger from "../../shared/constants/Logger";

const MAIN_ADMIN_EMAIL = process.env.MAIN_ADMIN_EMAIL!;
const MAIN_ADMIN_PASS = process.env.MAIN_ADMIN_PASSWORD_HASH!;
const JWT_SECRET = process.env.JWT_SECRET || "super-secret";

export class UnifiedAdminAuthService implements IUnifiedAuthService {
  private subadminRepo = new AdminSubAdminCompaign();
  private teacherRepo =new MongoTeacher()


async login( email: string, password: string): Promise<{ otpToken: string; role: "super_admin" | "sub_admin" | "Teacher" }> {
  if (email === MAIN_ADMIN_EMAIL) {
    const isMatch = await bcrypt.compare(password, MAIN_ADMIN_PASS);
    if (!isMatch) throw new Error(AdminError.UserDoesNotExist);

    const otp = GenarateOtp(6);
    await SendEMail(email, "Super Admin OTP", `Your OTP is: ${otp}`);
    const otpToken = genarateotptoken(email, otp, { role: "super_admin" });

    return { otpToken, role: "super_admin" };
  }

  


const teacher = await this.teacherRepo.findByEmail(email);
console.log(teacher)
logger.info("Teacher fetched:", teacher);

if (!teacher) {
  logger.info("Teacher not found in DB");
}

if (teacher && teacher.role === "Teacher") {
  logger.info("Teacher role matches");
  logger.info(`Raw password: ${password}`);
  logger.info(`Stored hash: ${teacher.Password}`);

  const passwordValid = await bcrypt.compare(password, teacher.Password);
  logger.info("Password valid?", passwordValid);

  if (!passwordValid) {
    throw new Error("Invalid Teacher Credentials");
  }

  if (teacher.blocked) throw new Error("teacher blocked");

  const otp = GenarateOtp(6);
  await SendEMail(email, "Teacher OTP", `Your OTP is: ${otp}`);
  const otpToken = genarateotptoken(email, otp, { role: "Teacher", id: teacher.id });
  return { otpToken, role: "Teacher" };
}


  const subadmin = await this.subadminRepo.findByEmail(email);
  if (subadmin && subadmin.major_role === "sub_admin") {
    const isPasswordValid = await bcrypt.compare(password, subadmin.password);
    if (!isPasswordValid) throw new Error(AdminError.UserDoesNotExist);

       if(subadmin.blocked){
       throw new Error("subadmin blocked")
       }


    const otp = GenarateOtp(6);
    await SendEMail(email, "Sub Admin OTP", `Your OTP is: ${otp}`);
    const otpToken = genarateotptoken(email, otp, {
      role: "sub_admin",
      id: subadmin.id,
    });

    return { otpToken, role: "sub_admin" };
  }
  

logger.info("Reached end of login: throwing UserDoesNotExist");
throw new Error(AdminError.UserDoesNotExist);

}



async verifyOtp(  otpToken: string,  otp: string): Promise<{ authToken: string; role: "super_admin" | "sub_admin" | "Teacher"}> {
  const decoded = verifiedOtptoken(otpToken);
  if (!decoded) throw new Error(OtpError.OTP_ERROR);
  if (decoded.otp !== otp) {
    throw new Error(OtpError.INVALID_OTP);
  }

  const role = decoded.role as "super_admin" | "sub_admin" | "Teacher";

  const authToken = jwt.sign(
    { email: decoded.email, role, id: decoded.id },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { authToken, role };
}


 async resendOtp(oldOtpToken: string): Promise<{ otpToken: string }> {
  const decoded = decodedOtptoken(oldOtpToken);
  if (!decoded || !decoded.email) {
    throw new Error(OtpError.INVALID_OTP);
  }

  const newOtp = GenarateOtp(6);
  await SendEMail(decoded.email, "Resend OTP", `Your new OTP is: ${newOtp}`);

  const newOtpToken = genarateotptoken(decoded.email, newOtp, {
    role: decoded.role,
    id: decoded.id,
  });

  return { otpToken: newOtpToken };
}


}