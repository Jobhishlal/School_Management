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
    <div className="mt-6 space-y-4">
      {/* Mobile View: Card Layout */}
      <div className="grid grid-cols-1 gap-4 sm:hidden">
        {results.map((r, index) => (
          <div
            key={index}
            className={`p-4 rounded-2xl border transition-all ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-gray-50 border-gray-200"
              }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className={`font-bold text-base ${isDark ? "text-white" : "text-gray-900"}`}>{r.fullName}</h4>
                <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  Roll No: <span className={isDark ? "text-blue-400" : "text-blue-600"}>{r.rollNo || "N/A"}</span>
                </p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${r.progress === "EXCELLENT"
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
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-dashed border-gray-700/30">
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  Marks
                </p>
                <p className="text-sm font-bold text-blue-500">{r.marksObtained ?? "N/A"}</p>
              </div>
              <div className="text-right">
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  Remarks
                </p>
                <p className={`text-xs font-medium italic ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  "{r.remarks || "Well Done"}"
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View: Table */}
      <div
        className={`hidden sm:block rounded-2xl border overflow-hidden ${isDark ? "bg-slate-800/50 border-slate-700 text-slate-100" : "bg-white border-gray-200 text-slate-900"
          }`}
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className={`${isDark ? "bg-slate-700/50 text-gray-400" : "bg-gray-50 text-gray-500"}`}>
              <th className="p-4 text-left text-xs font-black uppercase tracking-widest">Student Name</th>
              <th className="p-4 text-left text-xs font-black uppercase tracking-widest">Roll No</th>
              <th className="p-4 text-left text-xs font-black uppercase tracking-widest">Marks</th>
              <th className="p-4 text-left text-xs font-black uppercase tracking-widest">Progress</th>
              <th className="p-4 text-left text-xs font-black uppercase tracking-widest">Remarks</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? "divide-slate-700" : "divide-gray-100"}`}>
            {results.map((r, index) => (
              <tr
                key={index}
                className={`transition-colors ${isDark ? "hover:bg-slate-700/30" : "hover:bg-blue-50/50"}`}
              >
                <td className="p-4 font-bold text-sm">{r.fullName}</td>
                <td className="p-4 text-sm font-medium text-gray-500">{r.rollNo || "N/A"}</td>
                <td className="p-4 text-sm font-black text-blue-500">{r.marksObtained ?? "N/A"}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${r.progress === "EXCELLENT"
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
                <td className="p-4 text-sm font-medium italic text-gray-500">"{r.remarks || "Well Done"}"</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassWiseExamResult;
