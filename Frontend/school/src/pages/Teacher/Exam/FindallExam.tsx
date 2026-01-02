
import React, { useEffect, useState } from "react";
import { GetTeacherExams } from "../../../services/authapi";
import type { ExamEntity } from "../../../types/ExamEntity";

interface TeacherExamsProps {
  onEditExam: (exam: ExamEntity) => void;
}

const TeacherExams: React.FC<TeacherExamsProps> = ({ onEditExam }) => {
  const [exams, setExams] = useState<ExamEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await GetTeacherExams();
        // Sort by examDate descending (Newest first)
        // Using [...data] to ensure we don't mutate the original array if it was cached/state
        const sortedData = [...data].sort((a: ExamEntity, b: ExamEntity) => {
          // Sort by examDate descending
          const dateA = new Date(a.examDate).getTime();
          const dateB = new Date(b.examDate).getTime();
          if (dateB !== dateA) {
            return dateB - dateA;
          }
          // Fallback to ID sorting (assuming MongoID, higher = newer) if dates are same
          return b.id.localeCompare(a.id);
        });
        setExams(sortedData);
      } catch (err) {
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
      <h2>My Exams</h2>
      {exams.length === 0 ? (
        <p>No exams created yet.</p>
      ) : (
        <table border={1} cellPadding={10}>
          <thead>
            <tr>
              <th>Exam ID</th>
              <th>Title</th>
              <th>Type</th>
              <th>Class</th>
              <th>Division</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Max Marks</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam.id}>
                <td>{exam.examId}</td>
                <td>{exam.title}</td>
                <td>{exam.type}</td>
                <td>{exam.className}</td>
                <td>{exam.division}</td>
                <td>{exam.subject}</td>
                <td>{new Date(exam.examDate).toLocaleDateString()}</td>
                <td>{exam.startTime}</td>
                <td>{exam.endTime}</td>
                <td>{exam.maxMarks}</td>
                <td>{exam.status}</td>
                <td>
                  <button onClick={() => onEditExam(exam)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeacherExams;
