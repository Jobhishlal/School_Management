import { ListParentfinance, CreatePayment } from "../../services/authapi";
import { useEffect, useState } from "react";


const loadRazorpayScript = () => {
  return new Promise<boolean>((resolve) => {

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existingScript) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function FinanceParentList() {
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const studentId = localStorage.getItem("studentId");
  const email = localStorage.getItem("email");


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!studentId || !email) {
          console.error("Missing email or studentId");
          return;
        }

        const res = await ListParentfinance(studentId, email);
        console.log("result", res.data);

        const student = res.data.data?.[0]?.student;
        setStudentData(student);
      } catch (error) {
        console.log("Error fetching:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [studentId, email]);


  const handlePayment = async (item: any) => {
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Razorpay SDK failed to load. Check your internet connection.");
        return;
      }

      const amount = item?.feeItems?.[0]?.amount;
      if (!amount) {
        alert("Invalid amount for this payment");
        return;
      }

      const orderResponse = await CreatePayment({ amount });
      const orderData = orderResponse.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "Your School Name",
        description: item.name,
        order_id: orderData.id,
        handler: function (response: any) {
          alert("Payment successful!");
          console.log("Payment success:", response);
        },
        prefill: {
          email: email || "",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Payment initiation failed. Check console for details.");
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
        <p><strong>Student ID:</strong> {sid}</p>
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
                  <button
                    onClick={() => handlePayment(item)}
                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md"
                  >
                    Pay Now
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
