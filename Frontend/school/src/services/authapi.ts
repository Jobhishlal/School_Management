import api from "./api";
import { API_ROUTES } from "../constants/routes/Route";
import type { AdminDoc, AdminResponseDTO } from '../types/Admin';
import type {VerifyOtpResponse,ResendOtpResponse} from '../types/Role'


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


export const MainAdminLogin = async (email: string, password: string) => {
  const res = await api.post(API_ROUTES.SUPERADMIN.LOGIN, { email, password });
  return res.data;
};



export const GetSubAdmins = async () => {
  const res = await api.get(API_ROUTES.ADMIN.GET_SUBADMINS);
  return res.data;
};

export const SubAdminCreate = async(name:string,email:string,phone:string,role:string)=>{
  const res = await api.post(API_ROUTES.ADMIN.CREATE_SUBADMIN,{name,email,phone,role})
  return res.data
}

export const UpdateSubAdmin = async (
  id: string,
  updates: { name: string; email: string; phone: string; role: string }
) => {
  const res = await api.put(API_ROUTES.ADMIN.UPDATE_SUBADMIN(id), updates);
  return res.data;
};
export const SubAdminBlock = async (id: string, blocked: boolean) => {
  const res = await api.put(API_ROUTES.ADMIN.BLOCK_SUBADMIN(id), { blocked });
  return res.data;
};

export const GetAllteacher = async ()=>{
  const res = await api.get(API_ROUTES.ADMIN.TEACHER)
  return res.data
}




export const CreateTeachers = async (
  name: string,
  email: string,
  phone: string,
  gender: string,
  role: string,
  blocked: boolean,
  department: "LP" | "UP" | "HS",
  subjects?: { name: string; code: string }[],
  password?: string,
  files?: FileList | File[]
) => {
  const data = new FormData();

  data.append("name", name);
  data.append("email", email);
  data.append("phone", phone);
  data.append("gender", gender);
  data.append("role", role);
  data.append("blocked", blocked.toString());
  data.append("department", department); 

  if (password) data.append("Password", password);

  if (subjects && subjects.length > 0) {
    data.append("subjects", JSON.stringify(subjects)); 
  }

  if (files) {
    Array.from(files).forEach((file) => {
      data.append("documents", file);
    });
  }

  const res = await api.post(API_ROUTES.ADMIN.TEACHER, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};


export const UpdateTeacher = async (
  id: string,
  name: string,
  email: string,
  phone: string,
  gender: string,
  department?: "LP" | "UP" | "HS",
  subjects?: { name: string; code: string }[],
  files?: FileList | File[]
) => {
  const data = new FormData();
  data.append("name", name);
  data.append("email", email);
  data.append("phone", phone);
  data.append("gender", gender);

  if (department) data.append("department", department);
  if (subjects && subjects.length > 0) data.append("subjects", JSON.stringify(subjects));

  if (files) {
    Array.from(files).forEach(file => data.append("documents", file));
  }

  const res = await api.put(API_ROUTES.ADMIN.UPDATE_TEACHER(id), data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};


export const BlockTeacher = async(id:string,blocked:boolean)=>{
  const res = await api.put(API_ROUTES.ADMIN.BLOCK_TEACHER(id),{blocked})
  return res.data
}