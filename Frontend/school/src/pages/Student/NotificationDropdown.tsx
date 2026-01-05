import React, { useState } from "react";
import { AnnouncementModal } from "../admin/Announcement/AnnouncementModal";
import { useNavigate } from "react-router-dom";


interface Props {
  isOpen: boolean;
  onClose: () => void;
  announcements: any[];
  loading: boolean;
  onClear: () => void;
  unreadCount: number;
}

export const NotificationDropdown: React.FC<Props> = ({
  isOpen,
  onClose,
  announcements = [],
  loading = false,
  onClear,
  unreadCount
}) => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const usenavigate = useNavigate()


  const goToAnnouncements = () => {
  usenavigate("/student/notices");
};

  // Removed internal fetch logic as it is now handled by parent

  const getCategoryIcon = (scope: string) => {
    if (scope?.toLowerCase().includes("exam")) return "📝";
    if (scope?.toLowerCase().includes("event")) return "🎉";
    if (scope?.toLowerCase().includes("class")) return "🎓";
    if (scope?.toLowerCase().includes("all")) return "📢";
    return "📌";
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[998]"
        onClick={onClose}
      />

      <div className="fixed top-[70px] right-[20px] w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 z-[999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔔</span>
            <h3 className="font-bold text-white text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                {unreadCount} New
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onClear}
                className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full transition-all"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
              <p className="text-gray-500 dark:text-gray-400">Loading announcements...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">No announcements yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Check back later for updates</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-slate-800">
              {announcements.map((a, i) => (
                <li
                  key={i}
                  className="p-4 hover:bg-blue-50 dark:hover:bg-slate-800 cursor-pointer transition-all group"
                  onClick={() => setSelectedAnnouncement(a)}
                >
                  <div className="flex gap-3">
                    <div className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      {getCategoryIcon(a.scope)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight line-clamp-1 group-hover:text-blue-600">
                          {a.title}
                        </h4>
                        {a.status === "ACTIVE" && (
                          <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-1"></span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                        {a.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
                          <span>👥</span> {a.scope}
                        </span>
                        <span className="text-xs text-gray-400">
                          {getTimeAgo(a.activeTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

       {announcements.length > 0 && (
  <div className="p-3 bg-gray-50 dark:bg-slate-800 border-t dark:border-slate-700">
    <button
      onClick={goToAnnouncements}
      className="w-full text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 transition-all"
    >
      View All Announcements →
    </button>
  </div>
)}

      </div>

      {/* Modal */}
      {selectedAnnouncement && (
        <AnnouncementModal
          announcement={selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
        />
      )}
    </>
  );
};