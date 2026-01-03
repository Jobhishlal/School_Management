

// import {
//   ListParentfinance,
//   CreatePayment,
//   VerifyPeymentStatus,
//   ChangepeymentstatususingfeeId,
//   InvoiceDownload,
//   getTeachersList,
//   GetAllClass
// } from "../../services/authapi";

// import { useEffect, useState } from "react";
// import { loadRazorpayScript } from "../../utils/Razorpay";
// import { showToast } from "../../utils/toast";
// import { onlyDate } from "../../utils/DateConverter";

// export default function FinanceParentList() {
//   const [studentData, setStudentData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   const [classes, setClasses] = useState<any[]>([]);
//   const [teachers, setTeachers] = useState<any[]>([]);

//   const email = localStorage.getItem("email");

//   /* ------------------------
//      Fetch Student Finance
//   ------------------------ */
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const storedStudentId = localStorage.getItem("studentId");
//         if (!storedStudentId || !email) return;

//         const res = await ListParentfinance(storedStudentId, email);
//         const student = res.data.data?.[0]?.student;

//         localStorage.setItem("studentObjectId", student._id);
//         localStorage.setItem("studentCode", student.studentId);

//         setStudentData(student);
//       } catch (err) {
//         console.error("Finance fetch error", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [email]);

//   /* ------------------------
//      Fetch Class & Teacher
//   ------------------------ */
//   useEffect(() => {
//     const fetchMeta = async () => {
//       try {
//         const [classRes, teacherRes] = await Promise.all([
//           GetAllClass(),
//           getTeachersList()
//         ]);

//         setClasses(classRes.data || []);
//         setTeachers(teacherRes.data || []);
//       } catch (err) {
//         console.error("Meta fetch error", err);
//       }
//     };

//     fetchMeta();
//   }, []);

//   /* ------------------------
//      Teacher Lookup Map
//   ------------------------ */
//   const teacherMap = teachers.reduce((acc: any, t: any) => {
//     acc[t._id] = t;
//     return acc;
//   }, {});

//   /* ------------------------
//      Helpers
//   ------------------------ */
//   const isExpired = (expiryDate: string) =>
//     new Date(expiryDate) < new Date();

//   /* ------------------------
//      Razorpay Payment
//   ------------------------ */
//   const handlePayment = async (item: any) => {
//     const isLoaded = await loadRazorpayScript();
//     if (!isLoaded) return showToast("Razorpay failed");

//     const amount = item?.feeItems?.[0]?.amount;
//     if (!amount) return showToast("Invalid amount");

//     const studentMongoId = localStorage.getItem("studentObjectId");

//     const orderRes = await CreatePayment({
//       amount,
//       studentId: studentMongoId!,
//       feeRecordId: item._id,
//       method: "razorpay",
//     });

//     const order = orderRes.data.data;

//     const options = {
//       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//       amount: order.amount,
//       currency: "INR",
//       name: "BRAINNIX",
//       description: item.name,
//       order_id: order.id,

//       handler: async (response: any) => {
//         await VerifyPeymentStatus(order.id, "PAID");

//         await ChangepeymentstatususingfeeId(order.feeRecordId, {
//           paymentId: response.razorpay_payment_id,
//           razorpaySignature: response.razorpay_signature,
//           status: "PAID",
//           method: "razorpay",
//         });

//         const refreshed = await ListParentfinance(
//           localStorage.getItem("studentId")!,
//           email
//         );

//         setStudentData(refreshed.data.data?.[0]?.student);
//         showToast("Payment Successful");
//       },

//       prefill: { email },
//       theme: { color: "#3399cc" }
//     };

//     new (window as any).Razorpay(options).open();
//   };

//   /* ------------------------
//      Invoice Download
//   ------------------------ */
//   const handleViewInvoice = async (item: any) => {
//     const res = await InvoiceDownload(item.paymentId || item._id);
//     const blob = new Blob([res.data], { type: "application/pdf" });
//     const url = URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "Invoice.pdf";
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   /* ------------------------
//      Render
//   ------------------------ */
//   if (loading) return <p className="text-white">Loading...</p>;
//   if (!studentData) return <p>No student data</p>;

//   return (
//     <div className="p-4 text-white">
//       <h2 className="text-xl font-bold mb-3">Finance Details</h2>

//       <table className="w-full border border-gray-700">
//         <thead>
//           <tr>
//             <th className="border p-2">Fee</th>
//             <th className="border p-2">Start</th>
//             <th className="border p-2">Expiry</th>
//             <th className="border p-2">Amount</th>
//             <th className="border p-2">Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {studentData.finance.map((item: any, i: number) => {
//             const cls = classes.find(
//               c => c._id === studentData.class?._id
//             );
//             const teacher = cls ? teacherMap[cls.classTeacher] : null;

//             return (
//               <tr key={i}>
//                 <td className="border p-2">{item.name}</td>
//                 <td className="border p-2">{onlyDate(item.startDate)}</td>
//                 <td className="border p-2">{onlyDate(item.expiryDate)}</td>
//                 <td className="border p-2">₹{item.feeItems?.[0]?.amount}</td>

//                 <td className="border p-2 text-center space-y-1">
//                   {item.status === "PAID" ? (
//                     <button
//                       onClick={() => handleViewInvoice(item)}
//                       className="bg-blue-600 px-3 py-1 rounded"
//                     >
//                       Invoice
//                     </button>
//                   ) : isExpired(item.expiryDate) ? (
//                     <>
//                       <p className="text-red-500 font-semibold">
//                         Not Paid
//                       </p>
//                          <p className="text-red-500 font-semibold">please contact class teacher</p>
//                     </>
//                   ) : (
//                     <button
//                       onClick={() => handlePayment(item)}
//                       className="bg-green-600 px-3 py-1 rounded"
//                     >
//                       Pay Now
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// }

























import React, { useEffect, useState } from "react";
import {
  ListParentfinance,
  CreatePayment,
  VerifyPeymentStatus,
  ChangepeymentstatususingfeeId,
  InvoiceDownload,
  getTeachersList,
  GetAllClass
} from "../../services/authapi";
import { loadRazorpayScript } from "../../utils/Razorpay";
import { showToast } from "../../utils/toast";
import { onlyDate } from "../../utils/DateConverter";
import { useTheme } from "../../components/layout/ThemeContext";

export default function FinanceParentList() {
  const { isDark } = useTheme();
  
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedFee, setSelectedFee] = useState<any>(null);

  const email = localStorage.getItem("email");

  // Theme Classes
  const containerBg = isDark ? "bg-[#121A21] text-slate-100" : "bg-[#fafbfc] text-slate-900";
  const cardBg = isDark ? "bg-slate-800/50 border-gray-700" : "bg-white border-gray-300";
  const tableBg = isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-300";
  const tableHeaderBg = isDark ? "bg-slate-900/50" : "bg-gray-50";
  const tableRowHover = isDark ? "hover:bg-slate-700/30" : "hover:bg-gray-50";
  const borderColor = isDark ? "border-slate-700" : "border-gray-200";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600";
  const textPrimary = isDark ? "text-slate-100" : "text-slate-900";
  const modalBg = isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-300";
  const buttonSuccess = isDark ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-600 hover:bg-green-700 text-white";
  const buttonPrimary = isDark ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white";

  /* ------------------------
     Fetch Student Finance
  ------------------------ */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedStudentId = localStorage.getItem("studentId");
        if (!storedStudentId || !email) return;

        const res = await ListParentfinance(storedStudentId, email);
        const student = res.data.data?.[0]?.student;

        localStorage.setItem("studentObjectId", student._id);
        localStorage.setItem("studentCode", student.studentId);

        setStudentData(student);
      } catch (err) {
        console.error("Finance fetch error", err);
        showToast("Failed to load finance details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [email]);

  /* ------------------------
     Fetch Class & Teacher
  ------------------------ */
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [classRes, teacherRes] = await Promise.all([
          GetAllClass(),
          getTeachersList()
        ]);

        setClasses(classRes.data || []);
        setTeachers(teacherRes.data || []);
      } catch (err) {
        console.error("Meta fetch error", err);
      }
    };

    fetchMeta();
  }, []);

  /* ------------------------
     Teacher Lookup Map
  ------------------------ */
  const teacherMap = teachers.reduce((acc: any, t: any) => {
    acc[t._id] = t;
    return acc;
  }, {});

  /* ------------------------
     Helpers
  ------------------------ */
  const isExpired = (expiryDate: string) => new Date(expiryDate) < new Date();

  const getStatusInfo = (item: any) => {
    if (item.status === "PAID") {
      return {
        label: "PAID",
        color: "bg-green-900 text-green-300",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      };
    } else if (isExpired(item.expiryDate)) {
      return {
        label: "EXPIRED",
        color: "bg-red-900 text-red-300",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      };
    } else {
      return {
        label: "PENDING",
        color: "bg-yellow-900 text-yellow-300",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      };
    }
  };

  /* ------------------------
     Razorpay Payment
  ------------------------ */
  const handlePayment = async (item: any) => {
    try {
      setProcessingPayment(true);
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        showToast("Razorpay failed to load", "error");
        return;
      }

      const amount = item?.feeItems?.[0]?.amount;
      if (!amount) {
        showToast("Invalid amount", "error");
        return;
      }

      const studentMongoId = localStorage.getItem("studentObjectId");

      const orderRes = await CreatePayment({
        amount,
        studentId: studentMongoId!,
        feeRecordId: item._id,
        method: "razorpay",
      });

      const order = orderRes.data.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "BRAINNIX",
        description: item.name,
        order_id: order.id,

        handler: async (response: any) => {
          await VerifyPeymentStatus(order.id, "PAID");

          await ChangepeymentstatususingfeeId(order.feeRecordId, {
            paymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            status: "PAID",
            method: "razorpay",
          });

          const refreshed = await ListParentfinance(
            localStorage.getItem("studentId")!,
            email
          );

          setStudentData(refreshed.data.data?.[0]?.student);
          showToast("Payment Successful", "success");
        },

        prefill: { email },
        theme: { color: "#3399cc" }
      };

      new (window as any).Razorpay(options).open();
    } catch (err) {
      showToast("Payment failed", "error");
    } finally {
      setProcessingPayment(false);
    }
  };

  /* ------------------------
     Invoice Download
  ------------------------ */
  const handleViewInvoice = async (item: any) => {
    try {
      const res = await InvoiceDownload(item.paymentId || item._id);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice_${item.name}_${new Date().getTime()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Invoice downloaded successfully", "success");
    } catch (err) {
      showToast("Failed to download invoice", "error");
    }
  };

  // Calculate statistics
  const totalFees = studentData?.finance?.length || 0;
  const paidFees = studentData?.finance?.filter((f: any) => f.status === "PAID").length || 0;
  const pendingFees = studentData?.finance?.filter((f: any) => f.status !== "PAID" && !isExpired(f.expiryDate)).length || 0;
  const expiredFees = studentData?.finance?.filter((f: any) => f.status !== "PAID" && isExpired(f.expiryDate)).length || 0;

  const totalAmount = studentData?.finance?.reduce((sum: number, f: any) => 
    sum + (f.feeItems?.[0]?.amount || 0), 0) || 0;
  const paidAmount = studentData?.finance?.filter((f: any) => f.status === "PAID")
    .reduce((sum: number, f: any) => sum + (f.feeItems?.[0]?.amount || 0), 0) || 0;
  const pendingAmount = totalAmount - paidAmount;

  /* ------------------------
     Render
  ------------------------ */
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${containerBg}`}>
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className={textPrimary}>Loading finance details...</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${containerBg}`}>
        <div className={`text-center ${cardBg} rounded-lg border p-8`}>
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className={`text-lg font-medium ${textPrimary}`}>No student data found</p>
          <p className={textSecondary}>Please contact administration</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 min-h-screen transition-colors duration-300 ${containerBg}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-3xl font-bold mb-2 ${textPrimary}`}>Finance Management</h1>
          <p className={textSecondary}>View and manage your fee payments</p>
        </div>

        {/* Student Info Card */}
        <div className={`rounded-lg border p-6 mb-6 transition-colors duration-300 ${cardBg}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className={`text-sm ${textSecondary}`}>Student Name</p>
              <p className={`text-lg font-semibold ${textPrimary}`}>{studentData.name}</p>
            </div>
            <div>
              <p className={`text-sm ${textSecondary}`}>Student ID</p>
              <p className={`text-lg font-semibold ${textPrimary}`}>{studentData.studentId}</p>
            </div>
            <div>
              <p className={`text-sm ${textSecondary}`}>Class</p>
              <p className={`text-lg font-semibold ${textPrimary}`}>
                {studentData.class?.className || "N/A"} - {studentData.class?.division || ""}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className={`rounded-lg border p-4 transition-colors duration-300 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${textSecondary}`}>Total Fees</p>
                <p className={`text-2xl font-bold ${textPrimary}`}>{totalFees}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`rounded-lg border p-4 transition-colors duration-300 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${textSecondary}`}>Paid</p>
                <p className={`text-2xl font-bold ${textPrimary}`}>{paidFees}</p>
                <p className={`text-xs ${textSecondary}`}>₹{paidAmount.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`rounded-lg border p-4 transition-colors duration-300 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${textSecondary}`}>Pending</p>
                <p className={`text-2xl font-bold ${textPrimary}`}>{pendingFees}</p>
                <p className={`text-xs ${textSecondary}`}>₹{pendingAmount.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`rounded-lg border p-4 transition-colors duration-300 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${textSecondary}`}>Expired</p>
                <p className={`text-2xl font-bold ${textPrimary}`}>{expiredFees}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Fee Details Table */}
        <div>
          <h2 className={`text-xl font-semibold mb-4 ${textPrimary}`}>Fee Details</h2>
          
          {studentData.finance && studentData.finance.length === 0 ? (
            <div className={`text-center py-12 ${cardBg} rounded-lg border`}>
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className={`text-lg font-medium mb-2 ${textPrimary}`}>No fee records found</p>
              <p className={textSecondary}>Contact administration for more details</p>
            </div>
          ) : (
            <div className={`rounded-lg overflow-hidden border transition-colors duration-300 ${tableBg}`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b transition-colors duration-200 ${borderColor} ${tableHeaderBg}`}>
                      <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>Fee Name</th>
                      <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>Start Date</th>
                      <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>Expiry Date</th>
                      <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>Amount</th>
                      <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>Status</th>
                      <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentData.finance.map((item: any, i: number) => {
                      const statusInfo = getStatusInfo(item);
                      const cls = classes.find(c => c._id === studentData.class?._id);
                      const teacher = cls ? teacherMap[cls.classTeacher] : null;

                      return (
                        <tr key={i} className={`border-b transition-colors duration-200 ${borderColor} ${tableRowHover}`}>
                          <td className={`py-4 px-4 ${textPrimary}`}>
                            <p className="font-medium">{item.name}</p>
                            {item.academicYear && (
                              <p className={`text-sm ${textSecondary}`}>{item.academicYear}</p>
                            )}
                          </td>
                          <td className={`py-4 px-4 ${textPrimary}`}>{onlyDate(item.startDate)}</td>
                          <td className={`py-4 px-4 ${textPrimary}`}>{onlyDate(item.expiryDate)}</td>
                          <td className={`py-4 px-4 ${textPrimary} font-semibold`}>
                            ₹{(item.feeItems?.[0]?.amount || 0).toLocaleString()}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span className={statusInfo.color}>
                                {statusInfo.icon}
                              </span>
                              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                                {statusInfo.label}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            {item.status === "PAID" ? (
                              <button
                                onClick={() => handleViewInvoice(item)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${buttonPrimary}`}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                Invoice
                              </button>
                            ) : isExpired(item.expiryDate) ? (
                              <div>
                                <button
                                  onClick={() => setSelectedFee(item)}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 bg-red-600 hover:bg-red-700 text-white`}
                                >
                                  Contact Teacher
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handlePayment(item)}
                                disabled={processingPayment}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 ${buttonSuccess}`}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                Pay Now
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Contact Teacher Modal */}
        {selectedFee && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedFee(null)}>
            <div className={`rounded-lg border p-6 max-w-md w-full transition-colors duration-300 ${modalBg}`} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold ${textPrimary}`}>Payment Expired</h3>
                <button
                  onClick={() => setSelectedFee(null)}
                  className={`p-1 rounded-lg hover:bg-slate-700/30 transition-colors ${textSecondary}`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                  <p className={`text-sm ${textPrimary}`}>
                    The payment deadline for <span className="font-semibold">{selectedFee.name}</span> has expired.
                  </p>
                </div>

                <div>
                  <p className={`text-sm ${textSecondary} mb-2`}>Fee Details:</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={textSecondary}>Amount:</span>
                      <span className={`font-semibold ${textPrimary}`}>₹{(selectedFee.feeItems?.[0]?.amount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={textSecondary}>Expired on:</span>
                      <span className={textPrimary}>{onlyDate(selectedFee.expiryDate)}</span>
                    </div>
                  </div>
                </div>

                <div className={`border-t pt-4 ${borderColor}`}>
                  <p className={`text-sm ${textPrimary} mb-3`}>
                    Please contact your class teacher to resolve this payment issue.
                  </p>
                  
                  {(() => {
                    const cls = classes.find(c => c._id === studentData.class?._id);
                    const teacher = cls ? teacherMap[cls.classTeacher] : null;
                    
                    if (teacher) {
                      return (
                        <div className={`rounded-lg p-3 ${cardBg}`}>
                          <p className={`text-sm font-semibold ${textPrimary}`}>Class Teacher:</p>
                          <p className={textPrimary}>{teacher.name || "N/A"}</p>
                          {teacher.email && (
                            <p className={`text-sm ${textSecondary}`}>{teacher.email}</p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}