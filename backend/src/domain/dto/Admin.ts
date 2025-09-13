export interface CreateAdminDTO{
  username:string;
  email:string;
  password:string;
}


export interface CreateAdminWithOtpDTO extends CreateAdminDTO {
  otp: string;
  otpToken: string;
}


export interface AdminResponseDTO{
  id:string;
  username:string;
  email:string;
  message?:string;
}

export interface SignupResponseDTO{
  otpToken:string;
  message?:string;

}

export interface MainSuperAdmin{
  email:string;
  password:string
}