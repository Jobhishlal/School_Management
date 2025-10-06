import api from "./../api";
import { API_ROUTES } from "../../constants/routes/Route";
import type { AdminDoc, AdminResponseDTO } from '../../types/Admin';
import type {VerifyOtpResponse,ResendOtpResponse} from '../../types/Role'



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


export const ParentSignup = async (data: {
  studentId: string;
  email: string;
  password: string;
  
}) => {
  const res = await api.post(API_ROUTES.PARENTS.SIGNUP_PARENTS, data);
  return res.data; 
};


export const requestParentPasswordOtp = async (email: string) => {
  const res = await api.post(API_ROUTES.PARENTS.REQUEST_PASSWORD, { email });
  return res.data;
};

export const verifyParentOtp = async (otpToken: string, otp: string) => {
  const res = await api.post(API_ROUTES.PARENTS.VERIFY_OTP, { otpToken, otp });
  return res.data;
};

export const resetParentPassword = async (email: string, newPassword: string) => {
  const res = await api.put(API_ROUTES.PARENTS.RESET_PASSWORD, { email, newPassword });
  return res.data;
};