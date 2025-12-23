import React, { useEffect, useState } from "react";
import { StudentListoutexam } from "../../services/authapi";

interface Exam {
  id: string;
  examId: string;
  title: string;
  type: string;
  className: string;
  division: string;
  subject: string;
  examDate: string;
  startTime: string;
  endTime: string;
  maxMarks: number;
}

const StudentExamList: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await StudentListoutexam();
        console.log("daata",data)
        setExams(data.data || []); 
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch exams");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  if (loading) return <p>Loading exams...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Available Exams</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Exam ID</th>
            <th className="border p-2">Title</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Class</th>
            <th className="border p-2">Division</th>
            <th className="border p-2">Subject</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Start</th>
            <th className="border p-2">End</th>
            <th className="border p-2">Max Marks</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => (
            <tr key={exam.id}>
              <td className="border p-2">{exam.examId}</td>
              <td className="border p-2">{exam.title}</td>
              <td className="border p-2">{exam.type}</td>
              <td className="border p-2">{exam.className}</td>
              <td className="border p-2">{exam.division}</td>
              <td className="border p-2">{exam.subject}</td>
              <td className="border p-2">{new Date(exam.examDate).toLocaleDateString()}</td>
              <td className="border p-2">{exam.startTime}</td>
              <td className="border p-2">{exam.endTime}</td>
              <td className="border p-2">{exam.maxMarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentExamList;
