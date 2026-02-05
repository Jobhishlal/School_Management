import { useEffect, useState } from "react";
import { findallAnnouncement, deleteAnnouncement } from "../../../services/authapi";
import { showToast } from "../../../utils/toast";
import { Pagination } from "../../../components/common/Pagination";
import { useTheme } from "../../../components/layout/ThemeContext";
import { Table, type Column } from "../../../components/Table/Table";

import { type Announcement } from "../../../types/Announcement";

const PAGE_SIZE = 5;

const AnnouncementListOut = ({
  onEdit,
}: {
  onEdit: (a: Announcement) => void;
}) => {
  const { isDark } = useTheme();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await findallAnnouncement();
      let allAnnouncements = res.data || res;
      // Sort by activeTime descending (latest first)
      if (Array.isArray(allAnnouncements)) {
        allAnnouncements = allAnnouncements.sort((a: Announcement, b: Announcement) =>
          new Date(b.activeTime).getTime() - new Date(a.activeTime).getTime()
        );
      }
      setAnnouncements(allAnnouncements);
      setTotalPages(Math.ceil(allAnnouncements.length / PAGE_SIZE));
    } catch {
      showToast("Failed to fetch announcements", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        await deleteAnnouncement(id);
        showToast("Announcement deleted successfully", "success");
        fetchAnnouncements(); // Refresh list
      } catch (error) {
        showToast("Failed to delete announcement", "error");
      }
    }
  };

  // Slice announcements for current page
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentAnnouncements = announcements.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  // Define table columns
  const columns: Column<Announcement>[] = [
    { label: "Title", key: "title" },
    { label: "Scope", key: "scope" },
    { label: "Status", key: "status" },
  ];

  return (
    <div className="mt-8">


      {loading ? (
        <p className="text-sm opacity-70">Loading announcements...</p>
      ) : announcements.length === 0 ? (
        <p className="text-sm opacity-70">No announcements found</p>
      ) : (
        <>
          <div className="hidden md:block">
            <Table
              columns={columns}
              data={currentAnnouncements}
              isDark={isDark}
              actions={(a) => (
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(a)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            />
          </div>

          <div className="md:hidden space-y-4">
            {currentAnnouncements.map((announcement) => (
              <div
                key={announcement._id}
                className={`p-4 rounded-lg border shadow-sm ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
                  }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{announcement.title}</h3>
                    <div className="text-sm opacity-70 mt-1">
                      <span className="mr-3">Scope: {announcement.scope}</span>
                      <span>Status: {announcement.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => onEdit(announcement)}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(announcement._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default AnnouncementListOut;
