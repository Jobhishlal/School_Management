import React, { useEffect, useState } from "react";
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
      <h2 className="text-lg font-bold mb-4">Announcements</h2>

      {loading ? (
        <p className="text-sm opacity-70">Loading announcements...</p>
      ) : announcements.length === 0 ? (
        <p className="text-sm opacity-70">No announcements found</p>
      ) : (
        <>
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
