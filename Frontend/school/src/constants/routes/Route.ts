

export const API_ROUTES = {
  ADMIN: {
    SIGNUP: "/admin/signuppost",
    GET_SUBADMINS: "/admin/admins",
    CREATE_SUBADMIN: "/admin/adminscreate",
    UPDATE_SUBADMIN: (id: string) => `/admin/admins/${id}`,
    BLOCK_SUBADMIN: (id: string) => `/admin/admins/${id}/block`,
    TEACHER: "/admin/teacher",
    UPDATE_TEACHER: (id: string) => `/admin/teacher/${id}`,
    BLOCK_TEACHER: (id: string) => `/admin/teacher/${id}/block`,
  },
  SUPERADMIN: {
    VERIFY_OTP: "/superadmin/verify-otp",
    RESEND_OTP: "/superadmin/resend-otp",
    LOGIN: "/superadmin/login",
  },
};
