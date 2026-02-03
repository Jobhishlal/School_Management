import React, { useState } from "react";
import type { CreateAnnouncementDTO } from "../../../types/CreateAnnouncementDTO";
import { type Announcement } from "../../../types/Announcement";
import { useTheme } from "../../../components/layout/ThemeContext";
import AnnouncementList from "./AnnouncementListOut";
import { Modal } from "../../../components/common/Modal";
import { AnnouncementForm } from "./AnnouncementForm";

const CreateAnnouncement: React.FC = () => {
  const { isDark } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<(CreateAnnouncementDTO & { _id: string }) | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0); 

  const handleEdit = (announcement: Announcement) => {
    const dto: CreateAnnouncementDTO & { _id: string } = {
      _id: announcement._id,
      title: announcement.title,
      content: announcement.content,
      scope: announcement.scope as "GLOBAL" | "CLASS" | "DIVISION",
      classes: announcement.classes || [],
      division: announcement.division,
      attachment: null, 
      activeTime: announcement.activeTime,
      endTime: announcement.endTime,
      status: announcement.status as "DRAFT" | "ACTIVE",
    };
    setEditItem(dto);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setEditItem(undefined);
    setRefreshKey((prev) => prev + 1); // Trigger list refresh
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditItem(undefined);
  };

  const containerBg = isDark
    ? "bg-[#121A21] text-white"
    : "bg-white text-gray-900";

  return (
    <div className={`p-6 rounded-lg ${containerBg}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Announcements</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Announcement
        </button>
      </div>

      <AnnouncementList onEdit={handleEdit} key={refreshKey} />

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={editItem ? "Edit Announcement" : "Create Announcement"}
      >
        <AnnouncementForm
          initialData={editItem}
          onSuccess={handleSuccess}
          onClose={handleClose}
        />
      </Modal>
    </div>
  );
};

export default CreateAnnouncement;
