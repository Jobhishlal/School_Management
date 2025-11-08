import { ListParentfinance } from "../../services/authapi";
import { useEffect, useState } from "react";

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

  if (loading) return <p className="text-white">Loading...</p>;
  if (!studentData) return <p className="text-white">No student data found.</p>;

  const { fullName, studentId: sid, class: studentClass, finance } = studentData;

  return (
    <div className="p-4 text-white">
      {/* --- Student Info --- */}
      <div className="mb-6 bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Student Information</h2>
        <p><strong>Name:</strong> {fullName}</p>
        <p><strong>Student ID:</strong> {sid}</p>
        <p>
          <strong>Class:</strong> {studentClass?.className} -{" "}
          {studentClass?.division}
        </p>
      </div>

      {/* --- Finance Info --- */}
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
            </tr>
          </thead>
          <tbody>
            {finance.map((item: any, index: number) => (
              <tr key={index}>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">
                  ₹{item.feeItems?.[0]?.amount || "—"}
                </td>
                <td className="border p-2">{item.academicYear}</td>
                <td className="border p-2">{item.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
