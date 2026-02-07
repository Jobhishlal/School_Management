
import { useEffect, useState } from "react";
import {
  ListParentfinance,
  CreatePayment,
  VerifyPeymentStatus,
  ChangepeymentstatususingfeeId,
  InvoiceDownload,
  getTeachersList,
  GetAllClass,
  GetParentPaymentHistory
} from "../../services/authapi";
import { loadRazorpayScript } from "../../utils/Razorpay";
import { showToast } from "../../utils/toast";
import { onlyDate } from "../../utils/DateConverter";
import { useTheme } from "../../components/layout/ThemeContext";
import { Pagination } from "../../components/common/Pagination";

export default function FinanceParentList() {
  const { isDark } = useTheme();

  const [viewMode, setViewMode] = useState<"FINANCE" | "HISTORY">("FINANCE");

  // Finance Data States
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedFee, setSelectedFee] = useState<any>(null);

  // History Data States
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });

  const email = localStorage.getItem("email") || "";

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

        if (student) {
          localStorage.setItem("studentObjectId", student._id);
          localStorage.setItem("studentCode", student.studentId);
          setStudentData(student);
        }
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
     Fetch Payment History
  ------------------------ */
  const fetchPaymentHistory = async (page = 1) => {
    const studentObjectId = localStorage.getItem("studentObjectId");
    if (!studentObjectId) return;

    setHistoryLoading(true);
    try {
      const res = await GetParentPaymentHistory(studentObjectId, page, 10);
      setHistoryData(res.data || []);
      setPagination({
        currentPage: res.page,
        totalPages: Math.ceil(res.total / res.limit),
        total: res.total
      });
    } catch (err) {
      console.error("History fetch error", err);
      showToast("Failed to load payment history", "error");
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode === "HISTORY") {
      fetchPaymentHistory();
    }
  }, [viewMode]);


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
      if (item.hasPenalty) {
        return {
          label: "PAID WITH PENALTY",
          color: "bg-orange-900 text-orange-300",
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      }
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

      const amount = item?.amount;
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


          await ChangepeymentstatususingfeeId(item._id, {
            paymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            status: "PAID",
            method: "razorpay",
          });

          const refreshed = await ListParentfinance(
            localStorage.getItem("studentId") || "",
            email
          );

          if (refreshed.data.data?.[0]?.student) {
            setStudentData(refreshed.data.data?.[0]?.student);
          }
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


  const handleViewInvoice = async (item: any) => {
    try {

      const idToUse = item.paymentId || item._id;

      const res = await InvoiceDownload(idToUse);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice_${item.name || "Payment"}_${new Date().getTime()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Invoice downloaded successfully", "success");
    } catch (err) {
      showToast("Failed to download invoice", "error");
    }
  };


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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div className="space-y-1">
            <h1 className={`text-xl md:text-3xl font-bold tracking-tight ${textPrimary}`}>Finance Management</h1>
            <p className={`text-xs md:text-base font-medium ${textSecondary}`}>Manage your student's fee payments</p>
          </div>

          <div className="flex w-full md:w-auto p-1 bg-slate-800/60 backdrop-blur-md rounded-xl md:rounded-2xl border border-slate-700/50 shadow-lg">
            <button
              onClick={() => setViewMode("FINANCE")}
              className={`flex-1 md:flex-none px-4 md:px-8 py-2 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm font-bold transition-all duration-300 ${viewMode === "FINANCE"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-400/20"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-700/40"
                }`}
            >
              Details
            </button>
            <button
              onClick={() => setViewMode("HISTORY")}
              className={`flex-1 md:flex-none px-4 md:px-8 py-2 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm font-bold transition-all duration-300 ${viewMode === "HISTORY"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-400/20"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-700/40"
                }`}
            >
              History
            </button>
          </div>
        </div>

        {/* Student Info Card - Common for both views */}
        <div className={`rounded-xl md:rounded-2xl border ${borderColor} p-4 md:p-6 transition-all duration-300 shadow-sm ${cardBg}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="space-y-0.5">
              <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${textSecondary}`}>Student Name</p>
              <p className={`text-sm md:text-lg font-extrabold truncate ${textPrimary}`}>{studentData.name}</p>
            </div>
            <div className="space-y-0.5">
              <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${textSecondary}`}>Student ID</p>
              <p className={`text-sm md:text-lg font-extrabold font-mono ${textPrimary}`}>{studentData.studentId}</p>
            </div>
            <div className="space-y-0.5 sm:col-span-2 lg:col-span-1">
              <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${textSecondary}`}>Class & Division</p>
              <p className={`text-sm md:text-lg font-extrabold ${textPrimary}`}>
                {studentData.class?.className || "N/A"} <span className="text-blue-500 mx-1">/</span> {studentData.class?.division || ""}
              </p>
            </div>
          </div>
        </div>

        {viewMode === "FINANCE" ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <div className={`rounded-xl md:rounded-2xl border ${borderColor} p-3 md:p-4 transition-all duration-300 shadow-sm ${cardBg} hover:shadow-md border-b-4 border-b-blue-500`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${textSecondary} mb-0.5 md:mb-1`}>Total</p>
                    <p className={`text-sm md:text-2xl font-black truncate ${textPrimary}`}>{totalFees} <span className="text-[10px] font-medium opacity-60">Fees</span></p>
                  </div>
                  <div className="shrink-0 w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <svg className="w-4 h-4 md:w-6 md:h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className={`rounded-xl md:rounded-2xl border ${borderColor} p-3 md:p-4 transition-all duration-300 shadow-sm ${cardBg} hover:shadow-md border-b-4 border-b-green-500`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${textSecondary} mb-0.5 md:mb-1`}>Paid</p>
                    <div className="flex flex-col md:flex-row md:items-baseline md:gap-2">
                      <p className={`text-sm md:text-2xl font-black ${textPrimary}`}>{paidFees}</p>
                      <p className={`text-[9px] md:text-xs font-bold text-green-500 truncate`}>₹{paidAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="shrink-0 w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                    <svg className="w-4 h-4 md:w-6 md:h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className={`rounded-xl md:rounded-2xl border ${borderColor} p-3 md:p-4 transition-all duration-300 shadow-sm ${cardBg} hover:shadow-md border-b-4 border-b-yellow-500`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${textSecondary} mb-0.5 md:mb-1`}>Pending</p>
                    <div className="flex flex-col md:flex-row md:items-baseline md:gap-2">
                      <p className={`text-sm md:text-2xl font-black ${textPrimary}`}>{pendingFees}</p>
                      <p className={`text-[9px] md:text-xs font-bold text-yellow-500 truncate`}>₹{pendingAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="shrink-0 w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                    <svg className="w-4 h-4 md:w-6 md:h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className={`rounded-xl md:rounded-2xl border ${borderColor} p-3 md:p-4 transition-all duration-300 shadow-sm ${cardBg} hover:shadow-md border-b-4 border-b-red-500`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${textSecondary} mb-0.5 md:mb-1`}>Expired</p>
                    <p className={`text-sm md:text-2xl font-black truncate ${textPrimary}`}>{expiredFees}</p>
                  </div>
                  <div className="shrink-0 w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                    <svg className="w-4 h-4 md:w-6 md:h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                <div className={`rounded-xl md:rounded-2xl overflow-hidden border ${borderColor} transition-all duration-300 shadow-sm ${tableBg}`}>
                  {/* Desktop View Table */}
                  <div className="hidden md:block overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    <table className="w-full min-w-[800px]">
                      <thead>
                        <tr className={`border-b transition-colors duration-200 ${borderColor} ${tableHeaderBg}`}>
                          <th className={`text-left py-4 px-4 font-bold uppercase tracking-wider text-[10px] md:text-xs ${textSecondary}`}>Fee Name</th>
                          <th className={`text-left py-4 px-4 font-bold uppercase tracking-wider text-[10px] md:text-xs ${textSecondary}`}>Period</th>
                          <th className={`text-left py-4 px-4 font-bold uppercase tracking-wider text-[10px] md:text-xs ${textSecondary}`}>Expiry Date</th>
                          <th className={`text-left py-4 px-4 font-bold uppercase tracking-wider text-[10px] md:text-xs ${textSecondary}`}>Amount</th>
                          <th className={`text-left py-4 px-4 font-bold uppercase tracking-wider text-[10px] md:text-xs ${textSecondary}`}>Status</th>
                          <th className={`text-left py-4 px-4 font-bold uppercase tracking-wider text-[10px] md:text-xs ${textSecondary}`}>Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/30">
                        {studentData.finance.map((item: any, i: number) => {
                          const statusInfo = getStatusInfo(item);
                          return (
                            <tr key={i} className={`transition-colors duration-200 ${tableRowHover}`}>
                              <td className={`py-4 px-4 ${textPrimary}`}>
                                <p className="font-bold">{item.name}</p>
                                {item.academicYear && (
                                  <p className={`text-xs font-medium opacity-60`}>{item.academicYear}</p>
                                )}
                              </td>
                              <td className={`py-4 px-4 ${textPrimary} font-medium`}>{onlyDate(item.startDate)}</td>
                              <td className={`py-4 px-4 ${textPrimary} font-medium`}>{onlyDate(item.expiryDate)}</td>
                              <td className={`py-4 px-4 ${textPrimary} font-black`}>
                                ₹{(item.amount || 0).toLocaleString()}
                              </td>
                              <td className="py-4 px-4">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wide ${statusInfo.color}`}>
                                  {statusInfo.icon}
                                  {statusInfo.label}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                {item.status === "PAID" ? (
                                  <button
                                    onClick={() => handleViewInvoice(item)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${buttonPrimary} shadow-md shadow-blue-500/20 active:scale-95`}
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    Invoice
                                  </button>
                                ) : (
                                  <div className="flex flex-col gap-1">
                                    <button
                                      onClick={() => handlePayment(item)}
                                      disabled={processingPayment}
                                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 disabled:opacity-50 ${item.hasPenalty ? "bg-red-600 hover:bg-red-700 text-white shadow-red-500/30" : `${buttonSuccess} shadow-green-500/30`} shadow-md active:scale-95`}
                                    >
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                      </svg>
                                      {item.hasPenalty ? "Pay Penalty" : "Pay Now"}
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card Layout */}
                  <div className="md:hidden divide-y divide-slate-700/30">
                    {studentData.finance.map((item: any, i: number) => {
                      const statusInfo = getStatusInfo(item);
                      return (
                        <div key={i} className="p-4 space-y-4">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h4 className={`text-sm font-black ${textPrimary} mb-0.5`}>{item.name}</h4>
                              <p className={`text-[10px] font-bold ${textSecondary} opacity-60 uppercase tracking-wider`}>
                                {item.academicYear || "Fee Record"}
                              </p>
                            </div>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-700/30">
                            <div>
                              <p className={`text-[9px] font-bold uppercase tracking-widest ${textSecondary} opacity-60 mb-1`}>Expired On</p>
                              <p className={`text-xs font-bold ${textPrimary}`}>{onlyDate(item.expiryDate)}</p>
                            </div>
                            <div className="text-right">
                              <p className={`text-[9px] font-bold uppercase tracking-widest ${textSecondary} opacity-60 mb-1`}>Amount Due</p>
                              <p className={`text-sm font-black text-blue-500`}>₹{(item.amount || 0).toLocaleString()}</p>
                            </div>
                          </div>

                          <div className="pt-1">
                            {item.status === "PAID" ? (
                              <button
                                onClick={() => handleViewInvoice(item)}
                                className={`w-full py-3 rounded-xl text-xs font-black transition-all ${buttonPrimary} flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.98]`}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                DOWNLOAD INVOICE
                              </button>
                            ) : (
                              <button
                                onClick={() => handlePayment(item)}
                                disabled={processingPayment}
                                className={`w-full py-3 rounded-xl text-xs font-black transition-all ${item.hasPenalty ? "bg-red-600 text-white shadow-red-500/30" : `${buttonSuccess} shadow-green-500/30`} flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] disabled:opacity-50`}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                {item.hasPenalty ? "PAY WITH PENALTY" : "PROCEED TO PAY"}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Transaction History View */
          <div>
            <h2 className={`text-xl font-semibold mb-4 ${textPrimary}`}>Transaction History</h2>

            {historyLoading && <div className={`text-center py-8 ${textSecondary}`}>Loading history...</div>}

            {!historyLoading && historyData.length === 0 && (
              <div className={`text-center py-8 ${textSecondary}`}>No transactions found</div>
            )}

            {!historyLoading && historyData.length > 0 && (
              <div className={`rounded-xl md:rounded-2xl overflow-hidden border ${borderColor} transition-all duration-300 shadow-sm ${tableBg}`}>
                {/* Desktop View Table */}
                <div className="hidden md:block overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className={`border-b transition-colors duration-200 ${borderColor} ${tableHeaderBg}`}>
                        <th className={`text-left py-4 px-4 font-bold uppercase tracking-wider text-[10px] md:text-xs ${textSecondary}`}>Fee Name</th>
                        <th className={`text-left py-4 px-4 font-bold uppercase tracking-wider text-[10px] md:text-xs ${textSecondary}`}>Date</th>
                        <th className={`text-left py-4 px-4 font-bold uppercase tracking-wider text-[10px] md:text-xs ${textSecondary}`}>Time</th>
                        <th className={`text-left py-4 px-4 font-bold uppercase tracking-wider text-[10px] md:text-xs ${textSecondary}`}>Amount</th>
                        <th className={`text-left py-4 px-4 font-bold uppercase tracking-wider text-[10px] md:text-xs ${textSecondary}`}>Status</th>
                        <th className={`text-left py-4 px-4 font-bold uppercase tracking-wider text-[10px] md:text-xs ${textSecondary}`}>Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                      {historyData.map((item: any) => (
                        <tr key={item.id} className={`transition-colors duration-200 ${tableRowHover}`}>
                          <td className={`py-4 px-4 ${textPrimary} font-bold`}>
                            {item.studentFeeId?.name || "N/A"}
                          </td>
                          <td className={`py-4 px-4 ${textPrimary} font-medium`}>{onlyDate(item.paymentDate)}</td>
                          <td className={`py-4 px-4 ${textPrimary} font-medium`}>
                            {new Date(item.paymentDate).toLocaleTimeString()}
                          </td>
                          <td className={`py-4 px-4 ${textPrimary} font-black`}>₹{item.amount.toLocaleString()}</td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide bg-green-500/10 text-green-500 border border-green-500/20">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleViewInvoice(item)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${buttonPrimary} shadow-md shadow-blue-500/20 active:scale-95`}
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                              Invoice
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card Layout */}
                <div className="md:hidden divide-y divide-slate-700/30">
                  {historyData.map((item: any) => (
                    <div key={item.id} className="p-4 space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className={`text-sm font-black ${textPrimary} mb-0.5`}>{item.studentFeeId?.name || "N/A"}</h4>
                          <p className={`text-[10px] font-bold ${textSecondary} opacity-60 uppercase tracking-wider`}>
                            Trans ID: {item.transactionId || "N/A"}
                          </p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-green-500/10 text-green-500 border border-green-500/20`}>
                          {item.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-700/30">
                        <div>
                          <p className={`text-[9px] font-bold uppercase tracking-widest ${textSecondary} opacity-60 mb-1`}>Paid On</p>
                          <p className={`text-xs font-bold ${textPrimary}`}>{onlyDate(item.paymentDate)}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-[9px] font-bold uppercase tracking-widest ${textSecondary} opacity-60 mb-1`}>Amount Paid</p>
                          <p className={`text-sm font-black text-green-500`}>₹{item.amount.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="pt-1">
                        <button
                          onClick={() => handleViewInvoice(item)}
                          className={`w-full py-3 rounded-xl text-xs font-black transition-all ${buttonPrimary} flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.98]`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          DOWNLOAD INVOICE
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={fetchPaymentHistory}
            />
          </div>
        )}


        {selectedFee && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedFee(null)}>
            <div className={`rounded-2xl border ${borderColor} p-5 md:p-8 max-w-lg w-full transition-all duration-300 shadow-2xl ${modalBg}`} onClick={(e) => e.stopPropagation()}>
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