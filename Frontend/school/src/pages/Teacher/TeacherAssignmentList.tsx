
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
        setAssignments(res.data || []);
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
    <div className={`p-4 rounded ${isDark ? "bg-[#121A21] text-white" : "bg-white text-black"}`}>
      <h2 className="mb-2 text-lg font-semibold">My Assignments</h2>

      {assignments.length === 0 ? (
        <p>No assignments found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className={`${isDark ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`}>
              {columns.map((col) => (
                <th key={col.label} className="px-4 py-2 text-left border-b border-gray-400">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-2 border-b border-gray-400 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((row, index) => (
              <tr
                key={row.id}
                className={
                  isDark
                    ? index % 2 === 0
                      ? "bg-gray-800 text-white border-b border-gray-700"
                      : "bg-gray-700 text-white border-b border-gray-600"
                    : index % 2 === 0
                      ? "bg-white text-black border-b border-gray-200"
                      : "bg-gray-100 text-black border-b border-gray-300"
                }
              >
                {columns.map((col) => (
                  <td key={col.label} className="px-4 py-2">
                    {col.render ? col.render(row) : row[col.key as keyof Assignment]}
                  </td>
                ))}
                <td className="px-4 py-2 flex gap-2 justify-center">
                  <button
                    className={`px-2 py-1 rounded ${isDark ? "bg-purple-600 text-white" : "bg-purple-500 text-white"}`}
                    onClick={() => navigate(`/teacher/assignment/${row.id}/submissions`)}
                  >
                    View Submissions
                  </button>
                  <button
                    className={`px-2 py-1 rounded ${isDark ? "bg-blue-600 text-white" : "bg-blue-500 text-white"}`}
                    onClick={() => setCurrentAssignment(row)}
                  >
                    Update
                  </button>
                  <button
                    className={`px-2 py-1 rounded ${isDark ? "bg-red-600 text-white" : "bg-red-500 text-white"}`}
                    onClick={() => handleDelete(row.id)}
                  >
                    Delete
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
