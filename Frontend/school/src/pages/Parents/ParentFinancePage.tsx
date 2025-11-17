
import { ListParentfinance, CreatePayment ,VerifyPeymentStatus,ChangepeymentstatususingfeeId,InvoiceDownload} from "../../services/authapi";
import { useEffect, useState } from "react";
import { loadRazorpayScript } from "../../utils/Razorpay";


export default function FinanceParentList() {
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedStudentId = localStorage.getItem("studentId");
        if (!storedStudentId || !email) {
          console.error("Missing email or studentId");
          return;
        }

        const res = await ListParentfinance(storedStudentId, email);
        console.log("result",res)
        const student = res.data.data?.[0]?.student;

        localStorage.setItem("studentObjectId", student._id); 
        localStorage.setItem("studentCode", student.studentId); 

        setStudentData(student);
      } catch (error) {
        console.error("Error fetching:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [email]);

  const handlePayment = async (item: any) => {
  try {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    const amount = item?.feeItems?.[0]?.amount;
    if (!amount) {
      alert("Invalid amount for this payment");
      return;
    }

    const studentMongoId = localStorage.getItem("studentObjectId");
    const feeRecordId = item._id;

    // Step 1: Create Razorpay order
    const orderResponse = await CreatePayment({
      amount,
      studentId: studentMongoId!,
      feeRecordId,
      method: "razorpay",
    });

    const orderData = orderResponse.data.data;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: "INR",
      name: "Your School Name",
      description: item.name,
      order_id: orderData.id,

      handler: async function (response: any) {
        try {
          alert("✅ Payment successful!");
          console.log("Payment success:", response);

          const { razorpay_payment_id, razorpay_signature } = response;

       
          const verifyRes = await VerifyPeymentStatus(orderData.id, "PAID");
          console.log("verifyRes", verifyRes);

          if (verifyRes.data.success && verifyRes.data.data.status === "PAID") {
            alert("🎉 Payment verified successfully!");

            const updateFeeRecordId = verifyRes.data.data.feeRecordId;
            console.log("updateFeeRecordId:", updateFeeRecordId);

           
           const Piadstatuscheck =  await ChangepeymentstatususingfeeId(updateFeeRecordId, {
              paymentId: razorpay_payment_id,
              razorpaySignature: razorpay_signature,
              status: "PAID",
              method: "razorpay",
            });
              console.log("paid status check",Piadstatuscheck)

            alert("💾 Payment status saved permanently!");

        
            const storedStudentId = localStorage.getItem("studentId");
            const refreshed = await ListParentfinance(storedStudentId!, email);
            const updatedStudent = refreshed.data.data?.[0]?.student;

            setStudentData(updatedStudent);
          } else {
            alert("⚠️ Payment verified, but backend update failed.");
          }
        } catch (err) {
          console.error("Payment verification failed:", err);
          alert("❌ Payment verification failed. Please contact support.");
        }
      },

      prefill: {
        email: email || "",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new (window as any).Razorpay(options);
    rzp1.open();
  } catch (error) {
    console.error("Payment initiation failed:", error);
    alert("Payment initiation failed. Check console for details.");
  }
};

const handleViewInvoice = async (item: any) => {
  try {
    const paymentId = item.paymentId || item._id || item.studentFeeId;
    console.log("paymentId",paymentId)

    if (!paymentId) {
      alert("❌ Payment ID missing, cannot download invoice.");
      return;
    }

    const response = await InvoiceDownload(paymentId);
    console.log("response",response)

    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);


    const link = document.createElement("a");
    link.href = fileURL;
    link.download = `Invoice-${paymentId}.pdf`;
    link.click();

 
    URL.revokeObjectURL(fileURL);

  } catch (error) {
    console.error("Invoice download failed:", error);
    alert(" Failed to download invoice");
  }
};



  if (loading) return <p className="text-white">Loading...</p>;
  if (!studentData) return <p className="text-white">No student data found.</p>;

  const { fullName, studentId: sid, class: studentClass, finance } = studentData;

  return (
    <div className="p-4 text-white">
      <div className="mb-6 bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Student Information</h2>
        <p><strong>Name:</strong> {fullName}</p>
        <p><strong>Student Code:</strong> {sid}</p>
        <p>
          <strong>Class:</strong> {studentClass?.className} -{" "}
          {studentClass?.division}
        </p>
      </div>

      <h2 className="text-xl font-bold mb-3">Finance Details</h2>
      {!finance || finance.length === 0 ? (
        <p>No finance records found</p>
      ) : (
        <table className="w-full border border-gray-700">
          <thead>
            <tr>
              <th className="border p-2">Fee Name</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Academic Year</th>
              <th className="border p-2">Notes</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {finance.map((item: any, index: number) => (
              <tr key={index}>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">₹{item.feeItems?.[0]?.amount || "—"}</td>
                <td className="border p-2">{item.academicYear}</td>
                <td className="border p-2">{item.notes}</td>
                <td className="border p-2 text-center">
                
                    {item.status === "PAID" ? (
                            <button
                     onClick={() => handleViewInvoice(item)}
                     className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md"
                     >
                      View Invoice
                      </button>
                       ) : (
                        <button
                        onClick={() => handlePayment(item)}
                       className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md"
                     >
                      Pay Now
                       </button>
                       )}


                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
