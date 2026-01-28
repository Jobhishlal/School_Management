import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { getTeachersForChat, type ChatUser } from '../../../services/ChatService';

interface TeacherListModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectTeacher: (teacher: ChatUser) => void;
    isDark: boolean;
    existingChatUserIds: Set<string>;
}

export default function TeacherListModal({ isOpen, onClose, onSelectTeacher, isDark, existingChatUserIds }: TeacherListModalProps) {
    const [teachers, setTeachers] = useState<ChatUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchTeachers();
        }
    }, [isOpen]);

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const data = await getTeachersForChat();
            setTeachers(data);
        } catch (error) {
            console.error("Error fetching teachers", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTeachers = teachers.filter(teacher =>
        !existingChatUserIds.has(teacher._id) &&
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className={`w-full max-w-md rounded-2xl shadow-xl flex flex-col max-h-[80vh] ${isDark ? 'bg-slate-800 text-white border border-slate-700' : 'bg-white text-slate-900'}`}>

                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-bold">New Message to Teacher</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 flex-1 overflow-hidden flex flex-col gap-4">

                    {/* Search */}
                    <div className={`relative flex items-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <Search size={18} className="absolute left-3" />
                        <input
                            type="text"
                            placeholder="Search teacher..."
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
                            <div className="text-center py-4 opacity-70">Loading teachers...</div>
                        ) : filteredTeachers.length === 0 ? (
                            <div className="text-center py-4 opacity-70">No teachers found</div>
                        ) : (
                            filteredTeachers.map(teacher => (
                                <div
                                    key={teacher._id}
                                    onClick={() => { onSelectTeacher(teacher); onClose(); }}
                                    className={`p-3 rounded-xl cursor-pointer flex items-center gap-3 transition ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                                        }`}
                                >
                                    <img
                                        src={teacher.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=random`}
                                        alt={teacher.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-sm">{teacher.name}</h4>
                                        <p className="text-xs opacity-60">{teacher.email}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
