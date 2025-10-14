

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
    ADMIN_UPDATE_PASSWORD:'/admin/adminprofile/update-password',
    Admin_Class_Division_Manage:'/admin/class-division-list',
    ASSIGN_TEACHER_CLASSES:'/admin/class-assign-teacher',
    GETALLTEACHERS_ASSIGN_CLASS:'/admin/class-teacher',
    CLASS_BASE_TEACHER_LIST:'/admin/teacher-list',
    CREATE_TIMETABLE:'/admin/create-timetable',
    GET_TIME_TABLE_LIST:'/admin/timetable-view',
   UPDATE_TIME_TABLE:(id:string)=>`/admin/timetable-update/${id}`,
    DELETE_TIME_TABLE:(id:string)=>`/admin/delete-time-table/${id}`


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
    UPDATE_STUDENT:(id:string)=>`/admin/students/${id}`,
    STUDENTPROFILEMANAGEMENT:(id:string)=>`/student/profile/${id}`,
    

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
