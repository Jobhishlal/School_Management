import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import api from '../../../services/api';
import { type ChatUser } from '../../../services/ChatService';

interface NewChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectStudent: (student: ChatUser) => void;
    isDark: boolean;
    existingChatUserIds: Set<string>;
}

interface ClassData {
    _id: string;
    className: string;
    division: string;
}

interface StudentData {
    _id?: string;
    id?: string;
    fullName: string;
    studentId: string;
    profileImage?: string;
    photos: { url: string }[];
}

export default function NewChatModal({ isOpen, onClose, onSelectStudent, isDark, existingChatUserIds }: NewChatModalProps) {
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [students, setStudents] = useState<StudentData[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchClasses();
            setSelectedClassId('');
            setStudents([]);
        }
    }, [isOpen]);

    const fetchClasses = async () => {
        try {
            // Using teacher endpoint
            const response = await api.get('/teacher/get-all-classes');
            // Check data structure based on ClassController
            setClasses(response.data.data);
        } catch (error) {
            console.error("Error fetching classes", error);
        }
    };

    const fetchStudents = async (classId: string) => {
        if (!classId) return;
        setLoading(true);
        try {
            const response = await api.get(`/teacher/class/${classId}/students`);
            // Controller returns { message, success, student } where student is the array
            setStudents(response.data.student || []);
        } catch (error) {
            console.error("Error fetching students", error);
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedClassId) {
            fetchStudents(selectedClassId);
        } else {
            setStudents([]);
        }
    }, [selectedClassId]);

    const handleSelectStudent = (student: StudentData) => {
        // Map StudentData to ChatUser
        // Fallback to .id if ._id is missing (Domain Entity change)
        const studentId = student.id || student._id || '';

        const chatUser: ChatUser = {
            _id: studentId,
            name: student.fullName, // Use fullName as name
            email: '', // Not always needed
            profileImage: student.photos?.[0]?.url || '',
            role: 'student',
            isGroup: false
        };
        onSelectStudent(chatUser);
        onClose();
    };

    const filteredStudents = students.filter(student => {
        const studentId = student.id || student._id || '';
        return !existingChatUserIds.has(studentId) && (
            student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className={`w-full max-w-md rounded-2xl shadow-xl flex flex-col max-h-[80vh] ${isDark ? 'bg-slate-800 text-white border border-slate-700' : 'bg-white text-slate-900'}`}>

                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-bold">New Message</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 flex-1 overflow-hidden flex flex-col gap-4">

                    {/* Class Selector */}
                    <div>
                        <label className="block text-sm font-medium mb-1 opacity-70">Select Class</label>
                        <select
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                            className={`w-full p-3 rounded-xl outline-none border transition ${isDark
                                ? 'bg-slate-700 border-slate-600 focus:border-blue-500'
                                : 'bg-gray-50 border-gray-200 focus:border-blue-500'
                                }`}
                        >
                            <option value="">-- Choose a Class --</option>
                            {classes.map(cls => (
                                <option key={cls._id} value={cls._id}>
                                    {cls.className} {cls.division}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Student List */}
                    {selectedClassId && (
                        <div className="flex-1 flex flex-col min-h-0">
                            {/* Search */}
                            <div className={`relative flex items-center mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                <Search size={18} className="absolute left-3" />
                                <input
                                    type="text"
                                    placeholder="Search student..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none transition-all ${isDark
                                        ? 'bg-slate-700/50 focus:bg-slate-700 text-slate-200 placeholder-slate-500'
                                        : 'bg-gray-50 border border-gray-200 focus:border-blue-400 text-slate-700'
                                        }`}
                                />
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-2">
                                {loading ? (
                                    <div className="text-center py-4 opacity-70">Loading students...</div>
                                ) : filteredStudents.length === 0 ? (
                                    <div className="text-center py-4 opacity-70">No students found</div>
                                ) : (
                                    filteredStudents.map(student => (
                                        <div
                                            key={student.id || student._id}
                                            onClick={() => handleSelectStudent(student)}
                                            className={`p-3 rounded-xl cursor-pointer flex items-center gap-3 transition ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                                                }`}
                                        >
                                            <img
                                                src={student.photos?.[0]?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.fullName)}&background=random`}
                                                alt={student.fullName}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div>
                                                <h4 className="font-semibold text-sm">{student.fullName}</h4>
                                                <p className="text-xs opacity-60">ID: {student.studentId}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
