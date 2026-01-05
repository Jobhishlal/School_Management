import React from "react";
import { createPortal } from "react-dom";

interface Props {
  announcement: any;
  onClose: () => void;
}

export const AnnouncementModal: React.FC<Props> = ({
  announcement,
  onClose,
}) => {
  if (!announcement) return null;

  const getDaysRemaining = (endTime: string) => {
    const days = Math.ceil((new Date(endTime).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return "Expired";
    if (days === 0) return "Ends today";
    if (days === 1) return "1 day left";
    return `${days} days left`;
  };

  const getCategoryIcon = (scope: string) => {
    if (scope?.toLowerCase().includes("exam")) return "📝";
    if (scope?.toLowerCase().includes("event")) return "🎉";
    if (scope?.toLowerCase().includes("class")) return "🎓";
    if (scope?.toLowerCase().includes("all")) return "📢";
    return "📌";
  };



  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex justify-center items-start p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-slate-900 w-full max-w-2xl mt-8 mb-8 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-all"
            aria-label="Close"
          >
            ✕
          </button>

          <div className="flex items-start gap-4 pr-8">
            <div className="text-4xl mt-1">{getCategoryIcon(announcement.scope)}</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
                {announcement.title}
              </h2>
              <div className="flex flex-wrap gap-2">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${announcement.status === "ACTIVE"
                  ? "bg-green-400 text-green-900"
                  : "bg-yellow-400 text-yellow-900"
                  }`}>
                  {announcement.status === "ACTIVE" ? "🟢 Active" : "⏸️ Inactive"}
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-white/20 text-white font-medium">
                  ⏰ {getDaysRemaining(announcement.endTime)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Main Content */}
          <div className="bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 p-6 rounded-xl mb-6 shadow-sm">
            <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed whitespace-pre-wrap">
              {announcement.content}
            </p>
          </div>

          {/* Attachment Section */}
          {announcement.attachment?.url && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <span>📎</span> Attachment
              </h3>
              <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 flex justify-center">
                {announcement.attachment.url.endsWith(".pdf") ? (
                  <a
                    href={announcement.attachment.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
                  >
                    <span>📄</span> View PDF Attachment
                  </a>
                ) : (
                  <img
                    src={announcement.attachment.url}
                    alt="attachment"
                    className="max-w-full max-h-80 object-contain rounded-lg shadow-md"
                  />
                )}
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-slate-800 rounded-lg p-4">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                <span>👥</span> Target Audience
              </div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {announcement.scope}
              </div>
            </div>

            <div className="bg-green-50 dark:bg-slate-800 rounded-lg p-4">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                <span>📅</span> Posted On
              </div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {new Date(announcement.activeTime).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-slate-800 rounded-lg p-4">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                <span>⏳</span> Valid Until
              </div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {new Date(announcement.endTime).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-slate-800 rounded-lg p-4">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                <span>🔔</span> Status
              </div>
              <div className={`font-semibold ${announcement.status === "ACTIVE"
                ? "text-green-600"
                : "text-yellow-600"
                }`}>
                {announcement.status}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-b-2xl border-t dark:border-slate-700">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-all"
          >
            Got it, Thanks!
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};