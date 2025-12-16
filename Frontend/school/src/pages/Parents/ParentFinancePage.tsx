

import {
  ListParentfinance,
  CreatePayment,
  VerifyPeymentStatus,
  ChangepeymentstatususingfeeId,
  InvoiceDownload,
  getTeachersList,
  GetAllClass
} from "../../services/authapi";

import { useEffect, useState } from "react";
import { loadRazorpayScript } from "../../utils/Razorpay";
import { showToast } from "../../utils/toast";
import { onlyDate } from "../../utils/DateConverter";

export default function FinanceParentList() {
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);

  const email = localStorage.getItem("email");

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
  const isExpired = (expiryDate: string) =>
    new Date(expiryDate) < new Date();

  /* ------------------------
     Razorpay Payment
  ------------------------ */
  const handlePayment = async (item: any) => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) return showToast("Razorpay failed");

    const amount = item?.feeItems?.[0]?.amount;
    if (!amount) return showToast("Invalid amount");

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
        showToast("Payment Successful");
      },

      prefill: { email },
      theme: { color: "#3399cc" }
    };

    new (window as any).Razorpay(options).open();
  };

  /* ------------------------
     Invoice Download
  ------------------------ */
  const handleViewInvoice = async (item: any) => {
    const res = await InvoiceDownload(item.paymentId || item._id);
    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Invoice.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ------------------------
     Render
  ------------------------ */
  if (loading) return <p className="text-white">Loading...</p>;
  if (!studentData) return <p>No student data</p>;

  return (
    <div className="p-4 text-white">
      <h2 className="text-xl font-bold mb-3">Finance Details</h2>

      <table className="w-full border border-gray-700">
        <thead>
          <tr>
            <th className="border p-2">Fee</th>
            <th className="border p-2">Start</th>
            <th className="border p-2">Expiry</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {studentData.finance.map((item: any, i: number) => {
            const cls = classes.find(
              c => c._id === studentData.class?._id
            );
            const teacher = cls ? teacherMap[cls.classTeacher] : null;

            return (
              <tr key={i}>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">{onlyDate(item.startDate)}</td>
                <td className="border p-2">{onlyDate(item.expiryDate)}</td>
                <td className="border p-2">₹{item.feeItems?.[0]?.amount}</td>

                <td className="border p-2 text-center space-y-1">
                  {item.status === "PAID" ? (
                    <button
                      onClick={() => handleViewInvoice(item)}
                      className="bg-blue-600 px-3 py-1 rounded"
                    >
                      Invoice
                    </button>
                  ) : isExpired(item.expiryDate) ? (
                    <>
                      <p className="text-red-500 font-semibold">
                        Not Paid
                      </p>
                         <p className="text-red-500 font-semibold">please contact class teacher</p>
                    </>
                  ) : (
                    <button
                      onClick={() => handlePayment(item)}
                      className="bg-green-600 px-3 py-1 rounded"
                    >
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
  );
}
