export type StaffLoginResponse = {
  otpToken: string;
  role: "super_admin" | "sub_admin" | "Teacher";
};

export type StudentLoginResponse = {
  authToken: string;
  role: "Students";
};

export type LoginResponse = StaffLoginResponse | StudentLoginResponse;