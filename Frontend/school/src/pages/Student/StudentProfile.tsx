import React, { useEffect, useState } from "react";
import { StudentProfile } from "../../services/Student/StudentApi";
import { useParams } from "react-router-dom";
import { showToast } from "../../utils/toast";
import { useTheme } from "../../components/layout/ThemeContext";
import { User, Phone, MapPin, School } from "lucide-react";

interface Student {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  studentId: string;
  parent?: {
    name: string;
    contactNumber: string;
    email?: string;
    relationship?: string;
  };
  classDetails?: {
    className: string;
    division: string;
    department: string;
    rollNumber: string;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  photos: { url: string; filename: string; uploadedAt: Date }[];
  blocked: boolean;
  role?: string;
}

export const StudentProfilePage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const { isDark } = useTheme();

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await StudentProfile();
        if (res?.data?.data) setStudent(res.data.data);
        else showToast("Student not found", "error");
      } catch (error) {
        showToast("Failed to load student profile", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!student)
    return (
      <p className="text-center mt-10 text-red-500">Student not found</p>
    );

  return (
    <div
      className={`min-h-screen p-4 sm:p-8 ${
        isDark ? "bg-[#121A21] text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="max-w-7xl mx-auto">
       
        <h2 className="text-3xl font-bold mb-1">Profile Management</h2>
        <p className="text-slate-400 mb-6">
          View detailed information about the student
        </p>

        <div className="flex border-b border-slate-700 mb-6">
          <div className="px-4 py-2 font-medium border-b-2 border-blue-500 text-blue-500">
            Student Profile
          </div>
        </div>

       
        <div
          className={`rounded-lg p-6 shadow-xl relative ${
            isDark ? "bg-slate-800/50" : "bg-white"
          }`}
        >
         
          <div className="flex flex-col items-center text-center mb-8">
            {student.photos?.length > 0 ? (
              <img
                src={student.photos[0].url}
                alt={student.fullName}
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 mb-4"
              />
            ) : (
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center mb-4 ${
                  isDark
                    ? "bg-slate-700 text-slate-400"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                No Photo
              </div>
            )}
            <h3 className="text-xl font-semibold">{student.fullName}</h3>
            <p className="text-slate-400">{student.role?.toUpperCase()}</p>
          </div>

         
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
            <div>
              <h3 className="text-lg font-semibold border-b border-slate-700 pb-2 mb-3 flex items-center gap-2">
                <User size={18} /> Basic Information
              </h3>
              <ul className="space-y-2 text-sm">
                <li><b>Student ID:</b> {student.studentId}</li>
                <li><b>Gender:</b> {student.gender}</li>
                <li>
                  <b>Date of Birth:</b>{" "}
                  {new Date(student.dateOfBirth).toLocaleDateString()}
                </li>
                <li><b>Blocked:</b> {student.blocked ? "Yes" : "No"}</li>
              </ul>
            </div>

            {/* Class Info */}
            <div>
              <h3 className="text-lg font-semibold border-b border-slate-700 pb-2 mb-3 flex items-center gap-2">
                <School size={18} /> Class Details
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <b>Class:</b> {student.classDetails?.className || "-"}
                </li>
                <li>
                  <b>Division:</b> {student.classDetails?.division || "-"}
                </li>
              
              </ul>
            </div>

            {/* Parent Info */}
            <div>
              <h3 className="text-lg font-semibold border-b border-slate-700 pb-2 mb-3 flex items-center gap-2">
                <Phone size={18} /> Parent Information
              </h3>
              <ul className="space-y-2 text-sm">
                <li><b>Name:</b> {student.parent?.name || "-"}</li>
                <li><b>Contact:</b> {student.parent?.contactNumber || "-"}</li>
                <li><b>Email:</b> {student.parent?.email || "-"}</li>
                <li><b>Relationship:</b> {student.parent?.relationship || "-"}</li>
              </ul>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-lg font-semibold border-b border-slate-700 pb-2 mb-3 flex items-center gap-2">
                <MapPin size={18} /> Address
              </h3>
              <ul className="space-y-2 text-sm">
                <li><b>Street:</b> {student.address?.street || "-"}</li>
                <li><b>City:</b> {student.address?.city || "-"}</li>
                <li><b>State:</b> {student.address?.state || "-"}</li>
                <li><b>Pincode:</b> {student.address?.pincode || "-"}</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-slate-500 border-t border-slate-700 pt-4">
            <p>Last Updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

