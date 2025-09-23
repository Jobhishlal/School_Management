import React from "react";

interface FileInputProps {
  label: string;
  onChange: (files: File[]) => void;
  multiple?: boolean;
}

export const FileInput: React.FC<FileInputProps> = ({ label, onChange, multiple = false }) => (
  <div className="flex flex-col gap-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type="file"
      multiple={multiple}
      onChange={(e) => e.target.files && onChange(Array.from(e.target.files))}
      className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
    />
  </div>
);