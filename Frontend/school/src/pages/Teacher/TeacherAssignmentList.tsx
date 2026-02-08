
import { useEffect, useState } from "react";
import { ListoutExistedAssignment } from "../../services/authapi";
import { useTheme } from "../../components/layout/ThemeContext";
import { useNavigate } from "react-router-dom";

export interface Assignment {
  id: string;
  Assignment_Title: string;
  description: string;
  subject: string;
  classId: string;
  className: string;
  division: string;
  Assignment_date: string;
  Assignment_Due_Date: string;
  attachments: any[];
  maxMarks: number;
  teacherId: string;
}

interface Props {
  setCurrentAssignment: (a: Assignment) => void;
  refreshTrigger?: boolean;
}

interface Column<T> {
  label: string;
  key?: keyof T;
  render?: (row: T) => React.ReactNode;
}

export default function TeacherAssignmentList({ setCurrentAssignment, refreshTrigger }: Props) {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      try {
        const res = await ListoutExistedAssignment();
        const sortedData = (res.data || []).sort((a: Assignment, b: Assignment) =>
          new Date(b.Assignment_date).getTime() - new Date(a.Assignment_date).getTime()
        );
        setAssignments(sortedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [refreshTrigger]);

  const handleDelete = (assignmentId: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
  };

  if (loading) return <p>Loading...</p>;

  const columns: Column<Assignment>[] = [
    { label: "Title", key: "Assignment_Title" },
    { label: "Subject", key: "subject" },
    { label: "Class", render: (row) => `${row.className} - ${row.division}` },
    { label: "Start Date", render: (row) => new Date(row.Assignment_date).toLocaleDateString() },
    { label: "Due Date", render: (row) => new Date(row.Assignment_Due_Date).toLocaleDateString() },
  ];

  return (
    <div className={`p-4 rounded-xl border ${isDark ? "bg-[#121A21] border-gray-700 text-white" : "bg-white border-gray-200 text-black"}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          My Assignments
        </h2>
        <div className={`text-xs font-bold px-3 py-1 rounded-full ${isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
          {assignments.length} Total
        </div>
      </div>

      {assignments.length === 0 ? (
        <div className="text-center py-12">
          <p className={isDark ? "text-gray-500" : "text-gray-400"}>No assignments found.</p>
        </div>
      ) : (
        <>
          {/* Mobile View: Card Layout */}
          <div className="grid grid-cols-1 gap-4 lg:hidden">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className={`p-4 rounded-xl border transition-all ${isDark ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"
                  }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{assignment.Assignment_Title}</h3>
                    <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                      {assignment.subject}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"}`}>
                    {assignment.className}-{assignment.division}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                      Start Date
                    </p>
                    <p className="text-sm font-medium">
                      {new Date(assignment.Assignment_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                      Due Date
                    </p>
                    <p className="text-sm font-bold text-orange-500">
                      {new Date(assignment.Assignment_Due_Date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    className={`w-full py-2.5 rounded-lg text-sm font-bold shadow-lg transition-all ${isDark ? "bg-purple-600/20 text-purple-400 hover:bg-purple-600/30" : "bg-purple-50 text-purple-600 hover:bg-purple-100"
                      }`}
                    onClick={() => navigate(`/teacher/assignment/${assignment.id}/submissions`)}
                  >
                    View Submissions
                  </button>
                  <div className="flex gap-2">
                    <button
                      className="flex-1 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all"
                      onClick={() => setCurrentAssignment(assignment)}
                    >
                      Update
                    </button>
                    <button
                      className={`flex-1 py-2 rounded-lg text-xs font-bold ${isDark ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : "bg-red-50 text-red-600 hover:bg-red-100"
                        } transition-all`}
                      onClick={() => handleDelete(assignment.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={isDark ? "bg-gray-800/50" : "bg-gray-50"}>
                  {columns.map((col) => (
                    <th key={col.label} className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {col.label}
                    </th>
                  ))}
                  <th className={`px-6 py-4 text-center text-xs font-bold uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-gray-700" : "divide-gray-200"}`}>
                {assignments.map((row) => (
                  <tr key={row.id} className={`transition-colors ${isDark ? "hover:bg-gray-800/30" : "hover:bg-blue-50/50"}`}>
                    {columns.map((col) => (
                      <td key={col.label} className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {col.render ? col.render(row) : (row[col.key as keyof Assignment] as React.ReactNode)}
                      </td>
                    ))}
                    <td className="px-6 py-4 flex gap-2 justify-center">
                      <button
                        className="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-all"
                        title="View Submissions"
                        onClick={() => navigate(`/teacher/assignment/${row.id}/submissions`)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </button>
                      <button
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all"
                        title="Update"
                        onClick={() => setCurrentAssignment(row)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                        title="Delete"
                        onClick={() => handleDelete(row.id)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
