
import React, { useEffect, useState } from "react";
import {
    AnnouncementCreate,
    GetAllClass,
    UpdateAnnouncement,
} from "../../../services/authapi";
import type { CreateAnnouncementDTO } from "../../../types/CreateAnnouncementDTO";
import { showToast } from "../../../utils/toast";
import { useTheme } from "../../../components/layout/ThemeContext";
import { FormLayout } from "../../../components/Form/FormLayout";

interface ClassType {
    _id: string;
    className: string;
    divisions: string[];
}

interface AnnouncementFormProps {
    initialData?: CreateAnnouncementDTO & { _id?: string };
    onSuccess: () => void;
    onClose: () => void;
}

export const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
    initialData,
    onSuccess,
}) => {
    const { isDark } = useTheme();

    const [classes, setClasses] = useState<ClassType[]>([]);
    const [divisions, setDivisions] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        if (initialData) {
            setForm({
                ...initialData,
                attachment: null, // Reset attachment on edit init as we can't prefill file input
                classes: initialData.classes || [],
                activeTime: initialData.activeTime ? new Date(initialData.activeTime).toISOString().split('T')[0] : "",
                endTime: initialData.endTime ? new Date(initialData.endTime).toISOString().split('T')[0] : "",
            });
        }
    }, [initialData]);

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

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.scope === "DIVISION" && form.classes.length !== 1) {
            showToast("Division announcement must have exactly one class", "error");
            return;
        }

        try {
            setIsSubmitting(true);
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

            if (initialData?._id) {
                await UpdateAnnouncement(initialData._id, formData);
                showToast("Announcement updated successfully", "success");
            } else {
                await AnnouncementCreate(formData);
                showToast("Announcement created successfully", "success");
            }
            onSuccess();
        } catch (err: any) {
            showToast(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Operation failed",
                "error"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputBase = `w-full border p-2 rounded mb-3 focus:outline-none`;
    const inputTheme = isDark
        ? "bg-[#1e293b] text-white border-gray-600 placeholder-gray-400"
        : "bg-white text-gray-900 border-gray-300";

    return (
        <FormLayout onSubmit={submitHandler} isSubmitting={isSubmitting}>
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

            <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                    type="date"
                    name="activeTime"
                    value={form.activeTime}
                    onChange={handleChange}
                    className={`${inputBase} ${inputTheme}`}

                />
            </div>

            <div className="mb-3">
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                    type="date"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
                    className={`${inputBase} ${inputTheme}`}

                />
            </div>
            <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={`${inputBase} ${inputTheme}`}
            >
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Publish</option>
            </select>
        </FormLayout>
    );
};
