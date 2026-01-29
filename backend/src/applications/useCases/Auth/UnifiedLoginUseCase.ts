
import { ITokenService } from "../../interfaces/ITokenService";
import { IPasswordService } from "../../interfaces/IPasswordService";
import { IEmailService } from "../../interfaces/IEmailService";
import { StudentDetails } from "../../../domain/repositories/Admin/IStudnetRepository";
import { ITeacherCreate } from "../../../domain/repositories/TeacherCreate";
import { ISubadminLogin } from "../../../domain/repositories/IAdminRepoLogin";
import { IParentAuthRepository } from "../../../domain/repositories/IParentAuthRepository";
import { AdminError } from "../../../domain/enums/Adminsinguperror";
import { GenarateOtp } from "../../../shared/constants/utils/Otpgenarator";

import { IUnifiedLoginUseCase } from "../../../domain/UseCaseInterface/IUnifiedLoginUseCase";

export class UnifiedLoginUseCase implements IUnifiedLoginUseCase {
    constructor(
        private studentRepo: StudentDetails,
        private teacherRepo: ITeacherCreate,
        private subAdminRepo: ISubadminLogin,
        private parentRepo: IParentAuthRepository,
        private tokenService: ITokenService,
        private passwordService: IPasswordService,
        private emailService: IEmailService
    ) { }

    async execute(email?: string, password?: string, studentId?: string): Promise<
        | { otpToken: string; role: "super_admin" | "sub_admin" | "Teacher" }
        | { authToken: string; refreshToken: string; role: "Students" | "Parent" }
    > {
        const MAIN_ADMIN_EMAIL = process.env.MAIN_ADMIN_EMAIL!;
        const MAIN_ADMIN_PASS = process.env.MAIN_ADMIN_PASSWORD_HASH!;

        console.log("UnifiedLoginUseCase: reached login");

        // ---------------- Parent Login ----------------
        if (email && studentId) {
            console.log("UnifiedLoginUseCase: parent reached");
            const parent = await this.parentRepo.findByEmailAndStudentId(email, studentId);

            if (!parent) {
                throw new Error("Parent does not exist");
            }

            if (parent.student.studentId !== studentId) {
                throw new Error("Student ID does not match the parent");
            }

            const passwordValid = await this.passwordService.compare(password!, parent.password);
            if (!passwordValid) throw new Error("Invalid Parent Credentials");

            const role: "Parent" = "Parent";
            const authToken = this.tokenService.generateAccessToken({
                email: parent.email, role, id: parent.id, studentId: parent.studentId
            });
            const refreshToken = this.tokenService.generateRefreshToken({
                email: parent.email, role, id: parent.id, studentId: parent.studentId
            });

            return { authToken, refreshToken, role };
        }

        // ---------------- Student Login ----------------
        if (studentId) {
            const student = await this.studentRepo.findStudentid(studentId);
            if (!student) throw new Error(AdminError.UserDoesNotExist);

            const passwordValid = await this.passwordService.compare(password!, student.Password);
            if (!passwordValid) throw new Error(AdminError.UserDoesNotExist);
            if (student.blocked) throw new Error("Student is blocked");

            const role: "Students" = "Students";
            const authToken = this.tokenService.generateAccessToken({
                studentId: student.studentId, role, id: student.id
            });
            const refreshToken = this.tokenService.generateRefreshToken({
                studentId: student.studentId, role, id: student.id
            });

            return { authToken, refreshToken, role };
        }

        // ---------------- Super Admin Login ----------------
        if (email && email.trim() === MAIN_ADMIN_EMAIL) {
            const isMatch = await this.passwordService.compare(password!, MAIN_ADMIN_PASS);
            if (!isMatch) throw new Error(AdminError.UserDoesNotExist);

            const otp = GenarateOtp(6);
            console.log("UnifiedLoginUseCase: otp", otp);
            await this.emailService.send(email, "Super Admin OTP", `Your OTP is: ${otp}`);

            // Assuming generateOtpToken handles internal payload structure as expected by verify
            const otpToken = this.tokenService.generateOtpToken({ role: "super_admin", id: "main_admin", email }, otp);
            return { otpToken, role: "super_admin" };
        }

        // ---------------- Teacher Login ----------------
        if (email) {
            const teacher = await this.teacherRepo.findByEmail(email);
            if (teacher && teacher.role === "Teacher") {
                const passwordValid = await this.passwordService.compare(password!, teacher.Password);
                if (!passwordValid) throw new Error("Invalid Teacher Credentials");
                if (teacher.blocked) throw new Error("Teacher is blocked");

                const otp = GenarateOtp(6);
                console.log('UnifiedLoginUseCase: otp', otp);
                await this.emailService.send(email, "Teacher OTP", `Your OTP is: ${otp}`);

                const otpToken = this.tokenService.generateOtpToken({ role: "Teacher", id: teacher.id, email }, otp);
                return { otpToken, role: "Teacher" };
            }
        }

        // ---------------- Sub-admin Login ----------------
        if (email) {
            const subadmin = await this.subAdminRepo.findByEmail(email);
            if (subadmin && subadmin.major_role === "sub_admin") {
                const isPasswordValid = await this.passwordService.compare(password!, subadmin.password);
                if (!isPasswordValid) throw new Error("Invalid Credentials");

                const otp = GenarateOtp(6);
                console.log(otp);
                await this.emailService.send(email, "Sub Admin OTP", `Your OTP is: ${otp}`);

                const otpToken = this.tokenService.generateOtpToken({ role: "sub_admin", id: subadmin._id, email }, otp);
                return { otpToken, role: "sub_admin" };
            }
        }

        console.log("UnifiedLoginUseCase: UserDoesNotExist");
        throw new Error(AdminError.UserDoesNotExist);
    }
}
