import React, { useEffect, useState } from "react";
import {
  AnnouncementCreate,
  GetAllClass,
  UpdateAnnouncement,
} from "../../../services/authapi";
import type { CreateAnnouncementDTO } from "../../../types/CreateAnnouncementDTO";
import { showToast } from "../../../utils/toast";
import { useTheme } from "../../../components/layout/ThemeContext";
import AnnouncementList from "./AnnouncementListOut";

interface ClassType {
  _id: string;
  className: string;
  divisions: string[];
}

const CreateAnnouncement: React.FC = () => {
  const { isDark } = useTheme();

  const [classes, setClasses] = useState<ClassType[]>([]);
  const [divisions, setDivisions] = useState<string[]>([]);
  const [editItem, setEditItem] = useState<CreateAnnouncementDTO | null>(null);

  const [form, setForm] = useState<CreateAnnouncementDTO>({
    title: "",
    content: "",
    scope: "GLOBAL",
    classes: [],
    division: undefined,
    attachment: null,
    activeTime: "",
    endTime: "",
    status: "DRAFT",
  });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await GetAllClass();
        setClasses(res.data);
      } catch {
        showToast("Failed to load classes", "error");
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (form.scope === "DIVISION" && form.classes.length === 1) {
      const selectedClass = classes.find((cls) => cls._id === form.classes[0]);
      setDivisions(selectedClass?.divisions || []);
    } else {
      setDivisions([]);
    }
  }, [form.scope, form.classes, classes]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleScopeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const scope = e.target.value as "GLOBAL" | "CLASS" | "DIVISION";
    setForm({
      ...form,
      scope,
      classes: [],
      division: undefined,
    });
    setDivisions([]);
  };

  const handleClassCheckbox = (classId: string) => {
    setForm((prev) => {
      const exists = prev.classes.includes(classId);
      return {
        ...prev,
        classes: exists
          ? prev.classes.filter((id) => id !== classId)
          : [...prev.classes, classId],
        division: undefined,
      };
    });
  };

  const submitHandler = async () => {
    if (form.scope === "DIVISION" && form.classes.length !== 1) {
      showToast("Division announcement must have exactly one class", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("scope", form.scope);
      formData.append("status", form.status);
      formData.append("activeTime", form.activeTime);
      formData.append("endTime", form.endTime);
      form.classes.forEach((cls) => formData.append("classes[]", cls));
      if (form.division) formData.append("division", form.division);
      if (form.attachment) formData.append("attachment", form.attachment);

      if (editItem) {
        await UpdateAnnouncement(editItem._id!, formData);
        showToast("Announcement updated successfully", "success");
        setEditItem(null);
      } else {
        await AnnouncementCreate(formData);
        showToast("Announcement created successfully", "success");
      }

      setForm({
        title: "",
        content: "",
        scope: "GLOBAL",
        classes: [],
        division: undefined,
        attachment: null,
        activeTime: "",
        endTime: "",
        status: "DRAFT",
      });
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Operation failed",
        "error"
      );
    }
  };

  const handleEdit = (announcement: CreateAnnouncementDTO & { _id: string }) => {
    setEditItem(announcement);
    setForm({ ...announcement, attachment: null });
  };

  const containerBg = isDark
    ? "bg-[#121A21] text-white"
    : "bg-white text-gray-900";

  const inputBase = `w-full border p-2 rounded mb-3 focus:outline-none`;
  const inputTheme = isDark
    ? "bg-[#1e293b] text-white border-gray-600 placeholder-gray-400"
    : "bg-white text-gray-900 border-gray-300";

  return (
    <div>
      <div className={`p-6 rounded-lg max-w-xl ${containerBg}`}>
        <h2 className="text-xl font-bold mb-4">
          {editItem ? "Edit Announcement" : "Create Announcement"}
        </h2>

        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className={`${inputBase} ${inputTheme}`}
        />

        <textarea
          name="content"
          placeholder="Announcement content"
          value={form.content}
          onChange={handleChange}
          className={`${inputBase} ${inputTheme}`}
        />

        <select
          name="scope"
          value={form.scope}
          onChange={handleScopeChange}
          className={`${inputBase} ${inputTheme}`}
        >
          <option value="GLOBAL">Global</option>
          <option value="CLASS">Class</option>
          <option value="DIVISION">Division</option>
        </select>

        {(form.scope === "CLASS" || form.scope === "DIVISION") && (
          <div className="mb-3">
            <p className="font-medium mb-2">Select Classes</p>
            <div className="grid grid-cols-2 gap-2">
              {classes.map((cls) => (
                <label key={cls._id} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={form.classes.includes(cls._id)}
                    onChange={() => handleClassCheckbox(cls._id)}
                  />
                  {cls.className}
                </label>
              ))}
            </div>
          </div>
        )}

        {form.scope === "DIVISION" && (
          <select
            name="division"
            value={form.division || ""}
            onChange={handleChange}
            className={`${inputBase} ${inputTheme}`}
          >
            <option value="">Select Division</option>
            {divisions.map((div) => (
              <option key={div} value={div}>
                {div}
              </option>
            ))}
          </select>
        )}

        <input
          type="file"
          onChange={(e) =>
            setForm({
              ...form,
              attachment: e.target.files ? e.target.files[0] : null,
            })
          }
          className={`${inputBase} ${inputTheme}`}
        />

        <input
          type="date"
          name="activeTime"
          value={form.activeTime}
          onChange={handleChange}
          className={`${inputBase} ${inputTheme}`}
        />

        <input
          type="date"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          className={`${inputBase} ${inputTheme}`}
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className={`${inputBase} ${inputTheme}`}
        >
          <option value="DRAFT">Draft</option>
          <option value="ACTIVE">Publish</option>
        </select>

        <button
          onClick={submitHandler}
          className="bg-blue-600 text-white w-full py-2 rounded mt-2"
        >
          {editItem ? "Update Announcement" : "Create Announcement"}
        </button>
      </div>

      <AnnouncementList onEdit={handleEdit} />
    </div>
  );
};

export default CreateAnnouncement;
