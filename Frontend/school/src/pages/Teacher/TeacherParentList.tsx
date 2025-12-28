import React, { useEffect, useState } from "react";
import { GetStudentsByTeacher } from "../../services/authapi";
import { Loader2, Search, User, Phone, Mail, Users } from "lucide-react";
import { useTheme } from "../../components/layout/ThemeContext";

interface Parent {
    name: string;
    contactNumber: string;
    email: string;
    relationship: string;
}

interface Student {
    id: string;
    fullName: string;
    studentId: string; // Roll Number
    parent?: Parent;
    photos?: { url: string }[];
}

export const TeacherParentList: React.FC = () => {
    const { isDark } = useTheme();
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const bgPrimary = isDark ? "bg-[#121A21]" : "bg-slate-50";
    const cardBg = isDark ? "bg-slate-800/50" : "bg-white";
    const textPrimary = isDark ? "text-slate-100" : "text-slate-900";
    const textSecondary = isDark ? "text-slate-400" : "text-slate-600";
    const border = isDark ? "border-slate-700" : "border-slate-200";

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        const lowerTerm = searchTerm.toLowerCase();
        const filtered = students.filter(
            (s) =>
                s.fullName.toLowerCase().includes(lowerTerm) ||
                s.studentId.toLowerCase().includes(lowerTerm) ||
                s.parent?.name.toLowerCase().includes(lowerTerm)
        );
        setFilteredStudents(filtered);
    }, [searchTerm, students]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await GetStudentsByTeacher(); // Assuming this returns { students: [...] } or just [...]
            // Based on previous controller check: res.students
            const data = res.students || res.data || res;
            // Adjust depending on actual API structure. The controller sent { success: true, students: [...] }

            if (Array.isArray(data)) {
                setStudents(data);
                setFilteredStudents(data);
            } else {
                console.error("Unexpected API response format", data);
            }
        } catch (error) {
            console.error("Failed to fetch students", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className={`min-h-screen p-6 ${bgPrimary}`}>
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className={`text-2xl font-bold ${textPrimary}`}>Parent Details</h1>
                    <p className={textSecondary}>Contact information for student parents</p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search student or parent..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full rounded-xl border ${border} ${cardBg} py-2.5 pl-10 pr-4 text-sm ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                </div>
            </div>

            {/* List / Table */}
            <div className={`overflow-hidden rounded-xl border ${border} ${cardBg} shadow-sm`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className={`border-b ${border} ${isDark ? "bg-slate-900/50" : "bg-slate-100"}`}>
                            <tr>
                                <th className={`p-4 font-medium ${textSecondary}`}>Student</th>
                                <th className={`p-4 font-medium ${textSecondary}`}>Parent Name</th>
                                <th className={`p-4 font-medium ${textSecondary}`}>Relationship</th>
                                <th className={`p-4 font-medium ${textSecondary}`}>Contact</th>
                                <th className={`p-4 font-medium ${textSecondary}`}>Email</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/30">
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        No records found.
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr
                                        key={student.id}
                                        className={`group transition-colors ${isDark ? "hover:bg-slate-700/30" : "hover:bg-slate-50"
                                            }`}
                                    >
                                        {/* Student Column */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {student.photos && student.photos.length > 0 ? (
                                                    <img
                                                        src={student.photos[0].url}
                                                        alt={student.fullName}
                                                        className="h-10 w-10 rounded-full object-cover border border-slate-600"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                                        <span className="font-semibold">{student.fullName.charAt(0)}</span>
                                                    </div>
                                                )}
                                                <div>
                                                    <div className={`font-medium ${textPrimary}`}>{student.fullName}</div>
                                                    <div className="text-xs text-slate-500">ID: {student.studentId}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Parent Name */}
                                        <td className={`p-4 ${textPrimary}`}>
                                            <div className="flex items-center gap-2">
                                                <User size={16} className="text-slate-400" />
                                                {student.parent?.name || <span className="text-slate-500 italic">Not set</span>}
                                            </div>
                                        </td>

                                        {/* Relationship */}
                                        <td className={`p-4 ${textSecondary}`}>
                                            {student.parent?.relationship || "-"}
                                        </td>

                                        {/* Contact */}
                                        <td className={`p-4 ${textSecondary}`}>
                                            {student.parent?.contactNumber ? (
                                                <div className="flex items-center gap-2">
                                                    <Phone size={14} className="text-green-500" />
                                                    {student.parent.contactNumber}
                                                </div>
                                            ) : "-"}
                                        </td>

                                        {/* Email */}
                                        <td className={`p-4 ${textSecondary}`}>
                                            {student.parent?.email ? (
                                                <div className="flex items-center gap-2">
                                                    <Mail size={14} className="text-blue-500" />
                                                    {student.parent.email}
                                                </div>
                                            ) : "-"}
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
