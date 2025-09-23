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
  const bgInput = isDark ? "#334155" : "#ffffff";

  return (
    <div className="space-y-4">
      <TextInput label="Full Name" value={name} onChange={setName}  isDark={isDark} />
      <TextInput label="Email" type="email" value={email} onChange={setEmail}  isDark ={isDark}/>
      <TextInput label="Phone" type="tel" value={phone} onChange={setPhone}  isDark={isDark} />
      <SelectInput<string>
        label="Role"
        value={role}
        onChange={setRole}
        options={["Finance","Communication","School_Management","Student_Management","Parents_Management"]}
        isDark={isDark}
       
      />

      <div className="flex justify-end gap-3 pt-4">
        <button onClick={onCancel} disabled={loading} className="px-4 py-2 border rounded-lg">Cancel</button>
        <button onClick={onSubmit} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          {editing ? "Update Admin" : "Create Admin"}
        </button>
      </div>
    </div>
  );
};
