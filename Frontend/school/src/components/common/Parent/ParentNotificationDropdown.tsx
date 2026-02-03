import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { useSocket } from "../../../hooks/useSocket"; // Adjust path if needed
import { getParentProfile } from "../../../services/authapi";
import { getDecodedToken } from "../../../utils/DecodeToken";

interface Notification {
    title: string;
    content: string;
    type: 'ANNOUNCEMENT' | 'MEETING' | 'FINANCE';
    scope: 'GLOBAL' | 'CLASS' | 'DIVISION';
    link?: string;
    timestamp: number;
    read: boolean;
}

const ParentNotificationDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [student, setStudent] = useState<any>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const socket = useSocket();

    // Fetch Student Details
    useEffect(() => {
        const fetchStudentData = async () => {
            const decoded = getDecodedToken();
            if (decoded?.id) {
                try {
                    const data = await getParentProfile(decoded.id);
                    // data.profile.student contains filtering info like classId
                    if (data?.profile?.student) {
                        setStudent(data.profile.student);
                    }
                } catch (error) {
                    console.error("Failed to fetch student info for filtering notifications:", error);
                }
            }
        };
        fetchStudentData();
    }, []);

    useEffect(() => {
        if (!socket) return;

        console.log("Parent Notification Socket Initialized");

        const handleNotification = (data: any) => {
            console.log("New Notification Received:", data);

            // Filter logic:
            // 1. GLOBAL: Always show
            // 2. CLASS: Show if student's classId is in data.classes
            // 3. DIVISION: Show if student's division matches (omitted for now as simpler logic requested, but good to have)

            let shouldShow = false;
            if (data.scope === 'GLOBAL') {
                shouldShow = true;
            } else if (data.scope === 'CLASS' && student?.classId) {
                // Backend might send classId as string or array
                if (data.classes && data.classes.includes(student.classId)) {
                    shouldShow = true;
                }
            } else if (data.scope === 'DIVISION' && student?.classDetails?.division) {
                if (data.division === student.classDetails.division) {
                    shouldShow = true;
                }
            }

            if (shouldShow) {
                const newNotification: Notification = {
                    title: data.title,
                    content: data.content,
                    type: data.type,
                    scope: data.scope,
                    link: data.link,
                    timestamp: Date.now(),
                    read: false
                };

                setNotifications(prev => [newNotification, ...prev]);
                setUnreadCount(prev => prev + 1);
            }
        };

        socket.on("notification:new", handleNotification);

        return () => {
            socket.off("notification:new", handleNotification);
        };
    }, [socket, student]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            // Mark all as read when opening (optional, or mark individual)
            // setUnreadCount(0); 
        }
    };

    const markAsRead = () => {
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Notifications"
            >
                <Bell size={24} className="text-slate-600 dark:text-slate-300" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full animate-pulse border-2 border-white dark:border-slate-900">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden transform origin-top-right transition-all animate-in fade-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="p-4 border-b dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center backdrop-blur-sm">
                        <h3 className="font-semibold text-slate-800 dark:text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAsRead}
                                className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Notification List */}
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                                <Bell className="mx-auto h-12 w-12 opacity-20 mb-3" />
                                <p>No new notifications</p>
                            </div>
                        ) : (
                            notifications.map((notif, index) => (
                                <div
                                    key={index}
                                    className={`p-4 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!notif.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                                >
                                    <div className="flex justify-between items-start gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${notif.type === 'MEETING' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                                                        notif.type === 'FINANCE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                                    }`}>
                                                    {notif.type}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <h4 className="font-medium text-sm text-slate-900 dark:text-slate-100 mb-1">
                                                {notif.title}
                                            </h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                                {notif.content}
                                            </p>
                                            {notif.link && (
                                                <a href={notif.link} className="inline-block mt-2 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline">
                                                    View Details →
                                                </a>
                                            )}
                                        </div>
                                        {!notif.read && (
                                            <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ParentNotificationDropdown;
