

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
    ADMIN_PROFILE:'/admin/adminprofile',
    ADMIN_PROFILE_OWN_UPDATE: (id: string) => `/admin/adminprofile/${id}`,
    ADMIN_PASSWORD_REQUEST:`/admin/adminprofile/request-password-otp`,
    ADMIN_VERIFED_PASSWORD:'/admin/adminprofile/verify-password-otp',
    ADMIN_UPDATE_PASSWORD:'/admin/adminprofile/update-password'

  },
  SUPERADMIN: {
    VERIFY_OTP: "/superadmin/verify-otp",
    RESEND_OTP: "/superadmin/resend-otp",
    LOGIN: "/superadmin/login",
  },
  STUDENT:{
    CREATESTUDENT:"/admin/students",
    GETSTUDNET:'/admin/studnets',
    STUDENTBLOCK:(id:string)=>`/admin/students/${id}/block`,
    UPDATE_STUDENT:(id:string)=>`/admin/students/${id}`
    

  },
  PARENTS:{
    LIST_PARENTS:"/admin/parents",
    CREATE_PARENTS:"/admin/parents",
    UPDATE_PARENTS:(id:string)=>`/admin/parents/${id}`,
    SIGNUP_PARENTS:'/auth/signup',
    REQUEST_PASSWORD:"/auth/forgot-password",
    VERIFY_OTP:"/auth/verify-otp",
    RESET_PASSWORD:"/auth/reset-password"
  },
  CLASS:{
    LIST_CLASS:"/admin/class",
    CREATE_CLASS:'/admin/class',
    UPDATE_CLASS:(id:string)=>`/admin/class/${id}`
  },
  ADDRRESS:{
    LIST_ADDRESS:"/admin/address",
    CREATE_ADDRESS:"/admin/address",
    UPDATE_ADDRESS:(id:string)=>`/admin/address/${id}`
  },
  INSTITUTE:{
    CREATEINSTITUTE:"/admin/instituteprofile",
    GETINSTITUTE:"/admin/instituteprofile",
    UPDATE_INSTITUTE_PROFILE:(id:string)=>`/admin/instituteprofile/${id}`
  }

};
