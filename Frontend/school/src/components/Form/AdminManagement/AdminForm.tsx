import React from "react";
import { TextInput } from "../TextInput";
import { SelectInput } from "../SelectInput";

interface AdminFormProps {
  name: string;
  setName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  role: string;
  setRole: (val: string) => void;
  onSubmit: () => void;
  loading: boolean;
  isDark: boolean;
  onCancel: () => void;
  editing?: boolean;
}

export const AdminForm: React.FC<AdminFormProps> = ({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  role,
  setRole,
  onSubmit,
  loading,
  isDark,
  onCancel,
  editing = false,
}) => {


  return (
    <div className="space-y-5 py-2">
      <div className="space-y-4">
        <TextInput label="Full Name" value={name} onChange={setName} isDark={isDark} />
        <TextInput label="Email" type="email" value={email} onChange={setEmail} isDark={isDark} />
        <TextInput label="Phone" type="tel" value={phone} onChange={setPhone} isDark={isDark} />
        <SelectInput<string>
          label="Role"
          value={role}
          onChange={setRole}
          options={["Finance", "Communication", "School_Management", "Student_Management", "Parents_Management"]}
          isDark={isDark}
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-slate-700/30">
        <button
          onClick={onCancel}
          disabled={loading}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${isDark ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={loading}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? "Processing..." : (editing ? "Update Admin" : "Create Admin")}
        </button>
      </div>
    </div>
  );
};
