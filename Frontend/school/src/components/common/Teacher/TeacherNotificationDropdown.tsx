
import React from 'react';
import { createPortal } from 'react-dom';
import { Video, Calendar, Clock, X, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Meeting {
    _id?: string;
    title: string;
    description?: string;
    link: string;
    startTime: Date | string;
    type: string;
    status: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    notifications: Meeting[];
    onClear: () => void;
}

const TeacherNotificationDropdown: React.FC<Props> = ({
    isOpen,
    onClose,
    notifications,
    onClear,
}) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleJoin = (link: string) => {
  
        if (link.startsWith('http')) {
            window.open(link, '_blank');
        } else {
         
            window.location.href = link;
        }
    };

    const formatDate = (dateStr: string | Date) => {
        return new Date(dateStr).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    return createPortal(
        <>
            <div className="fixed inset-0 z-[998]" onClick={onClose} />
            <div className="fixed top-[70px] right-[20px] w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 z-[9999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <span className="p-1 bg-white/20 rounded-lg">
                            <Video size={18} />
                        </span>
                        <h3 className="font-bold text-lg">Meeting Alerts</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        {notifications.length > 0 && (
                            <button
                                onClick={onClear}
                                className="p-1.5 hover:bg-white/20 rounded-full transition-colors text-xs flex items-center gap-1"
                                title="Clear All"
                            >
                                <Trash2 size={14} />
                                Clear
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="max-h-[500px] overflow-y-auto bg-gray-50 dark:bg-slate-800/50">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                            <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-full mb-3">
                                <Calendar size={32} className="opacity-50" />
                            </div>
                            <p className="font-medium">No new meetings</p>
                            <p className="text-xs mt-1">You're all caught up!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-slate-700">
                            {notifications.map((meeting, idx) => (
                                <div key={idx} className="p-4 hover:bg-white dark:hover:bg-slate-800 transition-colors group">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">{meeting.title}</h4>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800 uppercase tracking-tight">
                                            {meeting.type}
                                        </span>
                                    </div>

                                    {meeting.description && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                                            {meeting.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/10 px-2 py-1 rounded">
                                            <Clock size={12} />
                                            <span>{formatDate(meeting.startTime)}</span>
                                        </div>
                                        <button
                                            onClick={() => handleJoin(meeting.link)}
                                            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md transition-colors shadow-sm font-medium"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

              
                {notifications.length > 0 && (
                    <div className="p-3 bg-white dark:bg-slate-900 border-t dark:border-slate-700 text-center">
                        <button
                            onClick={() => navigate('/teacher/schedule')}
                            className="text-xs text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        >
                            View Full Schedule
                        </button>
                    </div>
                )}
            </div>
        </>,
        document.body
    );
};

export default TeacherNotificationDropdown;
