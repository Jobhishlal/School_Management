import api from "./api";
import { API_ROUTES } from "../constants/routes/Route";
import { type CreateTimeTableDTO } from "../types/ITimetable";
import { type CreateAssignmentDTO } from "../types/AssignmentCreate";
import type { CreateFeeStructureDTO } from "../types/CreateFeeStructureDTO ";
import type { CreateFeeTypePayload } from "../types/CreateFeeTypePayload";
import type { ExpenseFormDTO } from "../types/ExpenseCreatedto";
import type { CreateAnnouncementDTO } from "../types/CreateAnnouncementDTO";
import type { TakeAttendancePayload } from "../types/AttendanceType";
import type { CreateExamDTO } from "../types/ExamCreateDTO";
import type { UpdateExamDTO } from "../types/UpdateExam";
import type { ExamEntity } from "../types/ExamEntity";
import type { CreateExamMarkRequestDTO } from "../types/CreateExamMarkDto";
import type { CreateLeaveDTO } from "../types/LeaveRequest/CreateLeaveRequest";

export const GetSubAdmins = async () => {
  const res = await api.get(API_ROUTES.ADMIN.GET_SUBADMINS);
  return res.data;
};

export const SubAdminCreate = async (name: string, email: string, phone: string, role: string) => {
  const res = await api.post(API_ROUTES.ADMIN.CREATE_SUBADMIN, { name, email, phone, role })
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

export const GetAllteacher = async () => {
  const res = await api.get(API_ROUTES.ADMIN.TEACHER)
  return res.data.data
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


export const BlockTeacher = async (id: string, blocked: boolean) => {
  const res = await api.put(API_ROUTES.ADMIN.BLOCK_TEACHER(id), { blocked })
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

export const GetAllParents = async () => {
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


export const GetAllClass = async () => {
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

export const GetAllAddress = async () => {
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


export const GetAllStudents = async () => {
  const res = await api.get(API_ROUTES.STUDENT.GETSTUDNET)
  return res.data
}


export const blockStudent = async (id: string, blocked: boolean) => {
  const res = await api.put(API_ROUTES.STUDENT.STUDENTBLOCK(id), { blocked })
  return res.data
}


export const UpdateStudent = async (
  id: string,
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


export const Getadminprofilemanagement = async () => {
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
  if (password) formData.append("password", password);

  documents?.forEach(file => formData.append("documents", file));
  photo?.forEach(file => formData.append("photo", file));

  const response = await api.put(`/admin/adminprofile/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};



export const RequestpasswordOtp = async (email: string) => {
  const res = await api.post(API_ROUTES.ADMIN.ADMIN_PASSWORD_REQUEST, { email })
  return res.data
}

export const verifyPasswordOtp = async (otpToken: string, otp: string) => {

  const res = await api.post(API_ROUTES.ADMIN.ADMIN_VERIFED_PASSWORD, { otpToken, otp })
  return res.data;
};


export const updatePassword = async (id: string, newPassword: string) => {
  const res = await api.put(`/admin/adminprofile/${id}/update-password`, { newPassword });
  return res.data;
};

export const getclassDivision = async (className: string) => {
  const res = await api.get(`/admin/class/next-division/${className}`)
  return res
}



export const classdivisonaccess = async () => {
  console.log("Get this page")
  const res = await api.get(API_ROUTES.ADMIN.Admin_Class_Division_Manage)
  return res
}
interface AssignClassTeacher {
  classId: string;
  teacherId: string;
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
  if (res.data.success) {
    return res.data.data;
  }
  return [];
};


export const CreateTimeTable = async (dto: CreateTimeTableDTO) => {
  const res = await api.post(API_ROUTES.ADMIN.CREATE_TIMETABLE, dto)
  return res.data
}


export const GetTimeTable = async (classId: string, division: string) => {
  const res = await api.get(`/admin/timetable-view/${classId}/${division}`);
  return res.data
}

export const updateTimeTable = async (dto: CreateTimeTableDTO) => {
  const res = await api.put(`/admin/timetable-update/${dto.id}`, dto);
  return res.data;
};



export const deletetimetable = async (id?: string) => {
  const res = await api.delete(`/admin/delete-time-table/${id}`)
  return res.data
}

export const createAssignment = async (data: CreateAssignmentDTO, files: File[]) => {
  const formData = new FormData();


  formData.append("Assignment_Title", data.Assignment_Title);
  formData.append("description", data.description);
  formData.append("subject", data.subject);
  formData.append("classId", data.classId);
  formData.append("division", data.division);
  formData.append("Assignment_date", data.Assignment_date.toISOString());
  formData.append("Assignment_Due_Date", data.Assignment_Due_Date.toISOString());
  formData.append("maxMarks", data.maxMarks.toString());

  files.forEach(file => {
    formData.append("documents", file);
  });

  const token = localStorage.getItem("token");
  const res = await api.post("/teacher/assignment", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
  });

  return res.data;
};



export const GetTeachertimetableList = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("/teacher/teacher-info", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
}

export const GetAllClassesAPI = async () => {
  const res = await api.get("/teacher/get-all-classes");
  return res.data.data;
};


export const UpdateExistedAssignment = async (id: string, formData: FormData) => {

  const res = await api.put(`/teacher/assignment/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};


export const ListoutExistedAssignment = async () => {

  const res = await api.get(`/teacher/assignments`)

  return res.data


}


export const createFinanceStructure = async (payload: CreateFeeStructureDTO) => {
  const res = await api.post("/admin/create-finance", payload);
  return res.data;
};


export const createfinancetype = async (paylaod: CreateFeeTypePayload) => {
  const res = await api.post('/admin/create-finance-type', paylaod)
  return res.data
}


export const GetAllFeeType = async () => {
  const res = await api.get('/admin/get-allfee-type')
  return res.data
}

export const ListParentfinance = async (studentId: string, email: string) => {
  const res = await api.post(`/parents/parent-finance-list`, { studentId, email });
  return res;
};


export const CreatePayment = async (data: {
  amount: number;
  studentId: string;
  feeRecordId: string;
  method?: string;

}) => {
  const res = await api.post("/parents/create-payment", data);
  return res;
};


export const VerifyPeymentStatus = async (id: string, status: string) => {
  const res = await api.put(`/parents/update-status/${id}`, { status })
  return res
}

export const ChangepeymentstatususingfeeId = async (feeId: string, paymentData: {
  paymentId: string;
  razorpaySignature: string;
  status: string;
  method: string;
}) => {
  const res = await api.post(`/parents/update-status-feeId/${feeId}`, paymentData);
  return res.data;
};



export const InvoiceDownload = async (paymentId: string) => {
  const res = await api.get(`/parents/invoice/${paymentId}`, {
    responseType: "blob"
  });
  return res;
}


export const ExpenseCreate = async (data: ExpenseFormDTO) => {
  const res = await api.post('/admin/crete-expense', data)
  return res
}


export const ExpanceApproval = async (expenseId: string, action: "APPROVED" | "REJECTED") => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Not authorized");

  const res = await api.patch(
    "/admin/expense/approve",
    { expenseId, action },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};


export const Pendingstatuslist = async () => {
  const res = await api.get('/admin/expense/pending')
  return res.data
}


export const ListOutFullExpense = async () => {
  const res = await api.get('/admin/expense/fulllist')
  return res.data
}

export const PendingExpenseUpdate = async (
  id: string,
  data: Partial<ExpenseFormDTO>
) => {
  const res = await api.put(`/admin/expense/updateexpense/${id}`, data);
  return res.data;
};


export const StudentFinanceCompleteDetails = async (classId: string, page: number = 1, limit: number = 10) => {
  const res = await api.get(`/admin/peyment/class/${classId}`, {
    params: { page, limit }
  })
  return res.data
}


export const GetPaymentHistory = async (params: { feeStructureId?: string, startDate?: string, endDate?: string, page?: number, limit?: number }) => {
  const res = await api.get('/admin/payment-history', { params });
  return res.data;
};

export const GetParentPaymentHistory = async (studentId: string, page: number = 1, limit: number = 10) => {
  const res = await api.get(`/parents/payment-history/${studentId}`, {
    params: { page, limit }
  });
  return res.data;
};

export const SearchPaymentHistoryNamebase = async (studentName: string) => {
  const res = await api.get('/admin/finance/searchName', {
    params: { studentName },
  });
  return res.data;
};

export const GetAllFeeStructures = async () => {
  const res = await api.get('/admin/fee-structures');
  return res.data;
};



export const FinanceReportRevenue = async (startDate: string, endDate: string) => {
  const res = await api.get('/admin/financereport', {
    params: { startDate, endDate }
  })
  return res.data.data
}

export const ExpenseReport = async () => {
  const res = await api.get('/admin/expense-report')
  return res.data.data
}



export const AnnouncementCreate = async (data: FormData) => {
  const res = await api.post('/admin/announcement', data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};




export const AnnouncementFetch = async () => {
  const res = await api.get("/student/announcement-find");
  return res.data;
};


// export const UpdateAnnouncement = async (
//   id: string,
//   data: FormData
// ) => {
//   const res = await api.put(`/admin/update-announcement/${id}`, data)
//   return res.data
// }
export const UpdateAnnouncement = async (id: string, data: FormData) => {
  const res = await api.put(`/admin/update-announcement/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};



export const findallAnnouncement = async () => {
  const res = await api.get('/admin/announcement/findall')
  return res.data
}


export const GetStudentsByTeacher = async () => {
  const res = await api.get("/teacher/attendance/students");
  return res.data;

}
export const AttendanceCreate = async (data: TakeAttendancePayload) => {
  const res = await api.post('/teacher/attendance/create', data)
  return res.data
}

export const fetchTodayAttendanceSummary = async (classId: string, status?: string) => {
  const query = status ? `?status=${status}` : "";
  const res = await api.get(`/teacher/attendance/summary/${classId}${query}`);


  return res.data?.attendance?.attendance ?? [];
};


export const ParentAttendanceList = async (parentId: string) => {
  const res = await api.get(`/parents/parent/attendance/today?parentId=${parentId}`);
  return res.data ?? [];
};


export const ExamCreate = async (data: CreateExamDTO) => {
  console.log("formdata", data)
  const res = await api.post("/teacher/exam/create", data);
  return res.data;
};


export const updateExam = async (id: string, data: UpdateExamDTO) => {
  console.log(id, data)

  const res = await api.put(`/teacher/exam/update/${id}`, data)
  return res.data
}

export const GetTeacherExams = async (): Promise<ExamEntity[]> => {

  const res = await api.get("/teacher/exams");
  return res.data.data;
};


export const StudentListoutexam = async () => {
  const res = await api.get('/student/exam/view-exam-list')
  return res.data
}


export const ExamMarkcreate = async (data: CreateExamMarkRequestDTO) => {
  console.log("reached here", data)
  const res = await api.post('/teacher/exammark/create', data)
  return res.data
}



export const getStudentsByExam = async (examId: string) => {
  console.log("djanfjkabjkfa bd", examId)
  const res = await api.get(`/teacher/exam/${examId}/students`);
  return res.data.data
};

export const getTeacherSchedule = async (day?: string) => {
  const query = day ? `?day=${day}` : "";
  const res = await api.get(`/teacher/schedule${query}`);
  return res.data.data;
};


export const FindClassBaseFindExam = async (classId: string) => {
  console.log("reached here")
  const res = await api.get(`/teacher/class/${classId}/exams`);
  return res.data;
};

export const getClassExamResults = async (examId: string) => {
  console.log("get class detals", examId)
  const res = await api.get(`/teacher/class/${examId}/results`);
  return res.data.data;
};


export const StudentExamResultView = async (classId: string, studentId?: string) => {
  const payload: any = { classId };
  if (studentId) {
    payload.studentId = studentId;
  }
  const res = await api.post("/student/exam/view-results", payload);
  return res.data;
};

export const RaiseExamConcern = async (examMarkId: string, concern: string) => {
  const res = await api.post("/student/exam/raise-concern", { examMarkId, concern });
  return res.data;
}


export const ResolveExamConcern = async (examMarkId: string, status: "Resolved" | "Rejected", newMarks?: number, responseMessage?: string) => {
  const res = await api.post("/teacher/exammark/resolve-concern", { examMarkId, status, newMarks, responseMessage });
  return res.data;
}

export const getParentProfile = async (id: string) => {
  const res = await api.get(`/parents/profile/${id}`);
  return res.data;
};



export const assignStudentToDivision = async (payload: {
  studentId: string | string[];
  classId: string;
}) => {
  const res = await api.post("/admin/assign-student-class", payload);
  return res.data;
};

export const CreateLeaveRequestSubAdmin = async (data: CreateLeaveDTO) => {
  const res = await api.post("/teacher/leave/sub-admin/request", data);
  return res.data;
};

export const GetSubAdminLeavesRequest = async () => {
  const res = await api.get('/teacher/leave/sub-admin/history')
  return res.data.leaves
}

export const deleteAnnouncement = async (id: string, config = {}) => {
  return await api.delete(`/admin/delete-announcement/${id}`, config);
};


export const validateAssignment = async (data: any) => {
  const res = await api.post("/teacher/assignment/validate", data);
  return res.data;
};

export const getAssignmentSubmissions = async (assignmentId: string) => {
  try {
    const res = await api.get(`/teacher/assignment/${assignmentId}/submissions`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const updateAttendance = async (studentId: string, date: Date, session: string, status: string) => {
  const res = await api.put('/teacher/attendance/update', { studentId, date, session, status });
  return res.data;
};


export const getAttendanceReport = async (classId: string, startDate: Date, endDate: Date) => {
  const res = await api.get(`/teacher/attendance/report/${classId}`, {
    params: { startDate, endDate }
  });
  return res.data;
};

export const getStudentAttendanceHistory = async (studentId: string, month: number, year: number) => {
  const res = await api.get(`/teacher/attendance/student/${studentId}/history`, {
    params: { month, year }
  });
  return res.data;
};


export const deleteClassOrDivision = async (id: string) => {
  const res = await api.put(`/admin/delete-classordivision/${id}`);
  return res.data;
};

export const attendacedatebasefilterparents = async (
  startDate: string,
  endDate: string
) => {
  const res = await api.get(`/parents/attendance/filter`, {
    params: { startDate, endDate }
  });

  return res.data;
};

export const StudentAttendanceList = async () => {
  const token = localStorage.getItem("studentAccessToken") || localStorage.getItem("accessToken");
  const res = await api.get(`/student/attendance/today`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export const studentAttendanceDateFilter = async (
  startDate: string,
  endDate: string
) => {
  const token = localStorage.getItem("studentAccessToken") || localStorage.getItem("accessToken");
  const res = await api.get(`/student/attendance/filter`, {
    params: { startDate, endDate },
    headers: { Authorization: `Bearer ${token}` }
  });

  return res.data;
};

export const updateExamMark = async (data: any, config = {}) => {
  return await api.put("/teacher/exammark/update", data, config);
};




export const LeaveRequest = async (leavedata: CreateLeaveDTO) => {
  const token = localStorage.getItem("token");

  const response = await api.post(

    "/teacher/leave/request",
    leavedata,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  console.log("i am reached heree", response)

  return response.data;
}

export const GetTeacherLeaves = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("/teacher/leave/teacher-history", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.leaves;
};

export const GetAllLeavesRequest = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("/admin/leave/all-requests", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.leaves;
};

export const UpdateLeaveStatus = async (
  leaveId: string,
  status: string,
  adminRemark?: string
) => {
  const token = localStorage.getItem("token");
  const res = await api.put("/admin/leave/update-status", {
    leaveId,
    status,
    adminRemark,
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getAdminProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("/admin/adminprofile", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};