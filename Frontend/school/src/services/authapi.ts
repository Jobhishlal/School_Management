import api from "./api";
import { API_ROUTES } from "../constants/routes/Route";
import { type CreateTimeTableDTO } from "../types/ITimetable";




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



export const CreateStudents = async (
  fullName: string,
  dateOfBirth: string,
  gender: "Male" | "Female" | "Other",
  parentId: string,
  addressId: string,
  classId: string,
  files: File[],
  
) => {
  const data = new FormData();

  data.append("fullName", fullName);
  data.append("dateOfBirth", dateOfBirth);
  data.append("gender", gender);
  data.append("parentId", parentId);
  data.append("addressId", addressId);
  data.append("classId", classId);

  if (files && files.length > 0) {
    files.forEach((file) => {
      data.append("photos", file);
    });
  }

  const res = await api.post(API_ROUTES.STUDENT.CREATESTUDENT, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });


  return res.data; 
};

export const GetAllParents = async()=>{
  const res = await api.get(API_ROUTES.PARENTS.LIST_PARENTS)
  return res.data
}

export const createParent = async (parentData: {
  name: string;
  contactNumber: string;
  whatsappNumber: string;
  email: string;
  relationship?: "Son" | "Daughter";
}) => {
  const res = await api.post(API_ROUTES.PARENTS.CREATE_PARENTS, parentData);
  return res.data;
};


export const GetAllClass = async()=>{
  const res = await api.get(API_ROUTES.CLASS.LIST_CLASS)
  return res.data
}

export const CreateClass = async (classData: {
  className: string;
  division: string;


}) => {
  const res = await api.post(API_ROUTES.CLASS.CREATE_CLASS, classData);
  return res.data;
};

export const GetAllAddress=async()=>{
  const res = await api.get(API_ROUTES.ADDRRESS.LIST_ADDRESS)
  return res.data
}
export const CreateAddress = async (addressData: {
  street: string;
  city: string;
  state: string;
  pincode: string;
}) => {
  const res = await api.post(API_ROUTES.ADDRRESS.CREATE_ADDRESS, addressData);
  return res.data;
};


export const GetAllStudents = async()=>{
  const res = await api.get(API_ROUTES.STUDENT.GETSTUDNET)
  return res.data
}


export const blockStudent = async(id:string,blocked:boolean)=>{
  const res = await api.put(API_ROUTES.STUDENT.STUDENTBLOCK(id),{blocked})
  return res.data
}


export const UpdateStudent = async (
  id:string,
  fullName: string,
  dateOfBirth: Date,
  gender: "Male" | "Female" | "Other",
  parentId: string,
  addressId: string,
  classId: string,
  files: File[],
  
) => {
  const data = new FormData();

  data.append("fullName", fullName);
  data.append("dateOfBirth", dateOfBirth.toString());
  data.append("gender", gender);
  data.append("parentId", parentId);
  data.append("addressId", addressId);
  data.append("classId", classId);

  if (files && files.length > 0) {
    files.forEach((file) => {
      data.append("photos", file);
    });
  }

  const res = await api.put(API_ROUTES.STUDENT.UPDATE_STUDENT(id), data, {
    headers: { "Content-Type": "multipart/form-data" },
  });


  return res.data; 
};
export const UpdateParents = async (
  id: string,
  name: string,

  whatsappNumber: string,
  email: string,
  relationship?: "Son" | "Daughter"
) => {
  return await api.put(API_ROUTES.PARENTS.UPDATE_PARENTS(id), {
    name,
    
    whatsappNumber,
    email,
    relationship
  });
};



export const UpdateClass = async (id: string, className: string, division: string) => {
  if (!id) {
    console.log(id)
    throw new Error("Class ID is missing");
  }

  const res = await api.put(API_ROUTES.CLASS.UPDATE_CLASS(id), { className, division });
  return res.data;
};

export const UpdateAddress = async (
  id: string,
  street: string,
  city: string,
  state: string,
  pincode: string
) => {
  const res = await api.put(API_ROUTES.ADDRRESS.UPDATE_ADDRESS(id), { street, city, state, pincode });
  return res.data; 
};

export const CreateInstituteProfile = async (
  instituteName: string,
  contactInformation: string,
  email: string,
  phone: string,
  addressId: string,
  principalName: string,
  logo: File[]
) => {
  const formData = new FormData();
  formData.append("instituteName", instituteName);
  formData.append("contactInformation", contactInformation);
  formData.append("email", email);
  formData.append("phone", phone);
  formData.append("addressId", addressId);
  formData.append("principalName", principalName);

  logo.forEach(file => formData.append("logo", file));

  const res = await api.post(API_ROUTES.INSTITUTE.CREATEINSTITUTE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};



export const getInstituteProfile = async () => {
  const res = await api.get(API_ROUTES.INSTITUTE.GETINSTITUTE);
  return res.data; 
};

export const UpdateInstituteProfile = async (
  id: string,
  instituteName: string,
  contactInformation: string,
  email: string,
  phone: string,
  addressId: string,
  principalName: string,
  logo: File[]
) => {
  const formData = new FormData();
  formData.append("instituteName", instituteName);
  formData.append("contactInformation", contactInformation);
  formData.append("email", email);
  formData.append("phone", phone);
  formData.append("addressId", addressId);
  formData.append("principalName", principalName);

  if (logo && logo.length > 0) {
    logo.forEach(file => formData.append("logo", file));
  }

  const res = await api.put(API_ROUTES.INSTITUTE.UPDATE_INSTITUTE_PROFILE(id), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};


export const Getadminprofilemanagement = async()=>{
  const res = await api.get(API_ROUTES.ADMIN.ADMIN_PROFILE)
  return res.data
}

export const UpdateAdminProfile = async (
  id: string,
  name: string,
  email: string,
  phone: string,
  gender: string,
  dateOfBirth: string,
  addressId?: string,
  documents?: File[],
  photo?: File[],
  password?: string
) => {
  const formData = new FormData();

  formData.append("name", name);
  formData.append("email", email);
  formData.append("phone", phone);
  formData.append("gender", gender);
  formData.append("dateOfBirth", dateOfBirth);

  if (addressId) formData.append("addressId", addressId);
  if (password) formData.append("password", password); // only append if exists

  documents?.forEach(file => formData.append("documents", file));
  photo?.forEach(file => formData.append("photo", file));

  const response = await api.put(`/admin/adminprofile/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};



export const RequestpasswordOtp = async (email:string)=>{
const res = await api.post(API_ROUTES.ADMIN.ADMIN_PASSWORD_REQUEST,{email})
return res.data
}

export const verifyPasswordOtp = async (otpToken: string, otp: string) => {
 
  const res = await api.post(API_ROUTES.ADMIN.ADMIN_VERIFED_PASSWORD,{otpToken,otp})
  return res.data; 
};


export const updatePassword = async (id: string, newPassword: string) => {
  const res = await api.put(`/admin/adminprofile/${id}/update-password`, { newPassword });
  return res.data;
};

export const getclassDivision = async(className:string)=>{
  const res = await api.get(`/admin/class/next-division/${className}`)
  return res
}



export const classdivisonaccess = async()=>{
  console.log("Get this page")
  const res = await api.get(API_ROUTES.ADMIN.Admin_Class_Division_Manage)
  return res
}
interface AssignClassTeacher{
  classId:string;
  teacherId:string;
}
export const AssignClassTeacherOnClass = async (payload: AssignClassTeacher) => {
console.log("here reached")
  const res = await api.post("/admin/class-assign-teacher", payload);


  return res.data;
};


export const GetAllTeachersClassassign = async (classId: string) => {
console.log("reached")
  const res = await api.get(`/admin/class-teacher/${classId}`);

  return res.data;
};


export const getTeachersList = async () => {
  const res = await api.get("/admin/teacher-list");
  if(res.data.success) {
    return res.data.data; 
  }
  return [];
};


export const CreateTimeTable = async(dto:CreateTimeTableDTO)=>{
  const res = await api.post(API_ROUTES.ADMIN.CREATE_TIMETABLE,dto)
  return res.data
}


export const GetTimeTable = async(classId:string,division:string)=>{
 const res = await api.get(`/admin/timetable-view/${classId}/${division}`);
  return res.data
}

export const updateTimeTable = async (dto: CreateTimeTableDTO) => {
  const res = await api.put(`/admin/timetable-update/${dto.id}`, dto);
  return res.data;
};



export const deletetimetable=async(id?:string)=>{
  const res = await api.delete( `/admin/delete-time-table/${id}`)
  return res.data
}