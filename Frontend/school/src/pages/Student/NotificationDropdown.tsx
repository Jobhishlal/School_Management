import React, { useEffect, useState } from "react";
import { AnnouncementFetch } from "../../services/authapi";
import { StudentProfile } from "../../services/Student/StudentApi";
import { AnnouncementModal } from "../admin/Announcement/AnnouncementModal";

export const NotificationDropdown = ({ isOpen, onClose }) => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchAnnouncements = async () => {
      try {
        setLoading(true);

        const profileRes = await StudentProfile();
        const student = profileRes.data.data;

        const res = await AnnouncementFetch(student.id, student.classId);
        if (res.success) setAnnouncements(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
    <div className="fixed top-[70px] right-[20px] w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 z-[999]">

        <div className="flex justify-between mb-2">
          <h3 className="font-semibold">Notifications</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : announcements.length === 0 ? (
          <p>No announcements</p>
        ) : (
          <ul className="space-y-2">
            {announcements.map((a, i) => (
              <li
                key={i}
                className="p-2 rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => setSelectedAnnouncement(a)}
              >
                <p className="font-semibold">{a.title}</p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {a.content}
                </p>
              </li>
            ))}
          </ul>
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
