export interface AdminDoc {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AdminResponseDTO {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  otpToken?: string;  
}
