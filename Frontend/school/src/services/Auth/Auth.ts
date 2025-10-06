import api from "./../api";
import { API_ROUTES } from "../../constants/routes/Route";
import type { AdminDoc, AdminResponseDTO } from '../../types/Admin';
import type {VerifyOtpResponse,ResendOtpResponse} from '../../types/Role'
import type{ LoginResponse } from "../../types/AuthRolecheck";


export const SignupAdmin = async (data: AdminDoc): Promise<AdminResponseDTO> => {
  const res = await api.post(API_ROUTES.ADMIN.SIGNUP, data);
  return res.data;
};
export const VerifyOtp = async (otpToken: string, otp: string): Promise<VerifyOtpResponse> => {
  const res = await api.post<VerifyOtpResponse>(API_ROUTES.SUPERADMIN.VERIFY_OTP, { otpToken, otp });
  return res.data;
};

export const ResendOtp = async (oldOtpToken: string): Promise<ResendOtpResponse> => {
  const res = await api.post<ResendOtpResponse>(API_ROUTES.SUPERADMIN.RESEND_OTP, { oldOtpToken });
  return res.data;
};


export const MainAdminLogin = async (email?: string, password?: string, studentId?: string) => {
  const res = await api.post(API_ROUTES.SUPERADMIN.LOGIN, { email, password, studentId });
  return res.data;
};
