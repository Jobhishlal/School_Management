import api from "./api";
import type { AdminDoc, AdminResponseDTO } from '../types/Admin';
import type {VerifyOtpResponse,ResendOtpResponse} from '../types/Role'


export const SignupAdmin = async (data: AdminDoc): Promise<AdminResponseDTO> => {
  const res = await api.post("/admin/signuppost", data);
  return res.data;
};
export const VerifyOtp = async (otpToken: string, otp: string): Promise<VerifyOtpResponse> => {
  const res = await api.post<VerifyOtpResponse>("/superadmin/verify-otp", { otpToken, otp });
  return res.data;
};

export const ResendOtp = async (oldOtpToken: string): Promise<ResendOtpResponse> => {
  const res = await api.post<ResendOtpResponse>("/superadmin/resend-otp", { oldOtpToken });
  return res.data;
};


export const MainAdminLogin = async (email: string, password: string) => {
  const res = await api.post("/superadmin/login", { email, password });
  return res.data;
};



export const GetSubAdmins = async () => {
  const res = await api.get("/admin/admins");
  return res.data;
};

export const SubAdminCreate = async(name:string,email:string,phone:string,role:string)=>{
  const res = await api.post("/admin/admins",{name,email,phone,role})
  return res.data
}

export const UpdateSubAdmin = async (
  id: string,
  updates: { name: string; email: string; phone: string; role: string }
) => {
  const res = await api.put(`/admin/admins/${id}`, updates);
  return res.data;
};
export const SubAdminBlock = async (id: string, blocked: boolean) => {
  const res = await api.put(`/admin/admins/${id}/block`, { blocked });
  return res.data;
};

export const GetAllteacher = async ()=>{
  const res = await api.get('/admin/teacher')
  return res.data
}

export const CreateTeachers = async (name:string,email:string,phone:string,gender:string)=>{
  const res = await api.post('/admin/teacher',{name,email,phone,gender})
  return res.data
}


export const UpdateTeacher = async ( id: string, name: string, email: string, phone: string, gender: string) => {
  const res = await api.put(`/admin/teacher/${id}`, { name, email, phone, gender,});
  return res.data;
};


export const BlockTeacher = async(id:string,blocked:boolean)=>{
  const res = await api.put(`/admin/teacher/${id}/block`,{blocked})
  return res.data
}