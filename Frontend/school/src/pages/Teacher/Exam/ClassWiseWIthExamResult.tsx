import React, { useEffect, useState } from "react";
import { getClassExamResults } from "../../../services/authapi";
import { showToast } from "../../../utils/toast";
import { useTheme } from "../../../components/layout/ThemeContext";

interface StudentResult {
  id: string;
  fullName: string;
  rollNo?: string;
  marksObtained?: number;
  progress?: string;
  remarks?: string;
}

interface Props {
  examId: string;
  examName?: string;
}

const ClassWiseExamResult: React.FC<Props> = ({ examId }) => {
  const { isDark } = useTheme();
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!examId) return;

    const fetchResults = async () => {
      try {
        const data = await getClassExamResults(examId);
        console.log("Exam results:", data);
        setResults(data);
      } catch (err) {
        console.error(err);
        showToast("Failed to load exam results", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [examId]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-32">
        <div
          className={`w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin`}
        ></div>
      </div>
    );

  if (results.length === 0)
    return <p className="text-gray-500 mt-4 text-center">No results found</p>;

  return (
    <div
      className={`mt-6 rounded shadow overflow-x-auto p-2 ${
        isDark ? "bg-slate-800/50 text-slate-100" : "bg-white text-slate-900"
      }`}
    >
      <table className="w-full border-collapse">
        <thead
          className={`${
            isDark ? "bg-slate-700 text-slate-100" : "bg-gray-100 text-gray-900"
          }`}
        >
          <tr>
            <th className="p-3 text-left">Student Name</th>
            <th className="p-3 text-left">Roll No</th>
            <th className="p-3 text-left">Marks</th>
            <th className="p-3 text-left">Progress</th>
            <th className="p-3 text-left">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, index) => (
            <tr
              key={index}
              className={`border-t ${
                isDark ? "border-slate-700" : "border-gray-200"
              }`}
            >
              <td className="p-3">{r.fullName}</td>
              <td className="p-3">{r.rollNo || "N/A"}</td>
              <td className="p-3">{r.marksObtained ?? "N/A"}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    r.progress === "EXCELLENT"
                      ? "bg-green-100 text-green-800"
                      : r.progress === "GOOD"
                      ? "bg-blue-100 text-blue-800"
                      : r.progress === "NEEDS_IMPROVEMENT"
                      ? "bg-yellow-100 text-yellow-800"
                      : r.progress === "POOR"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {r.progress || "Pending"}
                </span>
              </td>
              <td className="p-3">{r.remarks || "Well Done"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassWiseExamResult;
