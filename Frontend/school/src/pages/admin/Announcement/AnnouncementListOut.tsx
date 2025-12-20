import React, { useEffect, useState } from "react";
import { findallAnnouncement } from "../../../services/authapi";
import { showToast } from "../../../utils/toast";
import { Pagination } from "../../../components/common/Pagination";
import { useTheme } from "../../../components/layout/ThemeContext";
import { Table } from "../../../components/Table/Table";

interface Announcement {
  _id: string;
  title: string;
  content: string;
  scope: string;
  status: string;
  classes?: string[];
  division?: string;
}

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
      const allAnnouncements = res.data || res;
      setAnnouncements(allAnnouncements);
      setTotalPages(Math.ceil(allAnnouncements.length / PAGE_SIZE));
    } catch {
      showToast("Failed to fetch announcements", "error");
    } finally {
      setLoading(false);
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
              <button
                onClick={() => onEdit(a)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
              >
                Edit
              </button>
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
