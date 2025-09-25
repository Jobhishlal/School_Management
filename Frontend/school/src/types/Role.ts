export interface VerifyOtpResponse {
  authToken: string;
  role: "super_admin" | "sub_admin" | "Teacher";
}

export interface ResendOtpResponse {
  otpToken: string;
}