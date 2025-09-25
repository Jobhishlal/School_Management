

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
  STUDENT:{
    CREATESTUDENT:"/admin/students",
    GETSTUDNET:'/admin/studnets',
    STUDENTBLOCK:(id:string)=>`/admin/students/${id}/block`,
    UPDATE_STUDENT:(id:string)=>`/admin/students/${id}`
    

  },
  PARENTS:{
    LIST_PARENTS:"/admin/parents",
    CREATE_PARENTS:"/admin/parents",
    UPDATE_PARENTS:(id:string)=>`/admin/parents/${id}`
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
  }

};
