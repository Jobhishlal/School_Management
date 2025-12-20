import React from "react";

interface Props {
  announcement: any;
  onClose: () => void;
}

export const AnnouncementModal: React.FC<Props> = ({
  announcement,
  onClose,
}) => {
  if (!announcement) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-start">
    =
      <div
        className="
          relative
          bg-white dark:bg-slate-900
          w-[90%] max-w-[720px]
          mt-[50px]
          rounded-xl
          shadow-xl
          p-6
          max-h-[85vh]
          overflow-y-auto
        "
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="
            absolute top-4 right-4
            text-xl text-gray-500
            hover:text-red-600
          "
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-3 pr-8">
          {announcement.title}
        </h2>

        {/* Content */}
        <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
          {announcement.content}
        </p>

        {/* Attachment */}
        {announcement.attachment?.url && (
          <div className="mt-5 flex justify-center">
            {announcement.attachment.url.endsWith(".pdf") ? (
              <a
                href={announcement.attachment.url}
                target="_blank"
                rel="noreferrer"
                className="
                  bg-blue-600 hover:bg-blue-700
                  text-white px-4 py-2
                  rounded-md text-sm
                "
              >
                View Attachment
              </a>
            ) : (
              <img
                src={announcement.attachment.url}
                alt="attachment"
                className="
                  max-w-[320px]
                  max-h-[220px]
                  object-contain
                  rounded-md
                  border
                "
              />
            )}
          </div>
        )}

        {/* Meta Info */}
        <div className="mt-6 border-t pt-4 text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <div>
            <strong>Scope:</strong> {announcement.scope}
          </div>

         

          <div>
            <strong>Status:</strong>{" "}
            <span
              className={`font-semibold ${
                announcement.status === "ACTIVE"
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {announcement.status}
            </span>
          </div>

          <div>
            <strong>Active:</strong>{" "}
            {new Date(announcement.activeTime).toDateString()}
          </div>

          <div>
            <strong>Ends:</strong>{" "}
            {new Date(announcement.endTime).toDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};
