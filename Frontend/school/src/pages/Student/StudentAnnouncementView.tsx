import React, { useEffect, useState } from "react";
import { AnnouncementFetch } from "../../services/authapi";
import { useTheme } from "../../components/layout/ThemeContext";
import { Bell, Paperclip, Calendar, Clock } from "lucide-react";
import { type Announcement } from "../../types/Announcement";
import { Pagination } from "../../components/common/Pagination"; // Import Pagination

const PAGE_SIZE = 5;

export const StudentAnnouncementView: React.FC = () => {
    const { isDark } = useTheme();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await AnnouncementFetch();
                let data: Announcement[] = [];

                if (res && res.success && Array.isArray(res.data)) {
                    data = res.data;
                } else if (Array.isArray(res)) {
                    data = res;
                }

                // Sort by activeTime descending (latest first)
                data.sort((a, b) => new Date(b.activeTime).getTime() - new Date(a.activeTime).getTime());

                setAnnouncements(data);
                setTotalPages(Math.ceil(data.length / PAGE_SIZE));

            } catch (error) {
                console.error("Failed to fetch announcements", error);
                setAnnouncements([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAnnouncements();
    }, []);

    const cardBg = isDark ? "bg-[#1E293B] border-slate-700" : "bg-white border-gray-100";
    const textColor = isDark ? "text-slate-200" : "text-gray-800";
    const subText = isDark ? "text-slate-400" : "text-gray-500";

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Pagination Logic
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const currentAnnouncements = announcements.slice(startIndex, startIndex + PAGE_SIZE);

    return (
        <div className={`p-6 min-h-screen ${isDark ? "bg-[#121A21]" : "bg-slate-50"}`}>
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                    <Bell className="text-blue-500" size={24} />
                </div>
                <div>
                    <h1 className={`text-2xl font-bold ${textColor}`}>Announcements</h1>
                    <p className={subText}>Stay updated with latest school notices</p>
                </div>
            </div>

            <div className="grid gap-6 max-w-4xl mx-auto">
                {announcements.length === 0 ? (
                    <div className={`text-center py-12 rounded-2xl border ${cardBg}`}>
                        <Bell className={`mx-auto mb-3 ${subText}`} size={48} />
                        <p className={subText}>No announcements found</p>
                    </div>
                ) : (
                    <>
                        {currentAnnouncements.map((announcement) => (
                            <div
                                key={announcement._id}
                                className={`p-6 rounded-2xl border shadow-sm transition-all hover:shadow-md ${cardBg}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className={`text-xl font-semibold ${textColor}`}>
                                        {announcement.title}
                                    </h2>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${announcement.scope === "GLOBAL"
                                            ? "bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"
                                            : "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                                            }`}
                                    >
                                        {announcement.scope}
                                    </span>
                                </div>

                                <p className={`mb-6 leading-relaxed ${subText}`}>
                                    {announcement.content}
                                </p>

                                <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-100 dark:border-slate-700/50 text-sm">
                                    <div className={`flex items-center gap-2 ${subText}`}>
                                        <Calendar size={16} />
                                        <span>
                                            {new Date(announcement.activeTime).toLocaleDateString(undefined, {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>

                                    <div className={`flex items-center gap-2 ${subText}`}>
                                        <Clock size={16} />
                                        <span>
                                            Valid until: {new Date(announcement.endTime).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {announcement.attachment && (
                                        <a
                                            href={announcement.attachment.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-blue-500 hover:underline ml-auto"
                                        >
                                            <Paperclip size={16} />
                                            <span>View Attachment</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>
        </div>
    );
};
