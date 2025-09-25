import React from "react";
import { TextInput } from "../TextInput";
import { SelectInput } from "../SelectInput";

interface StudentInfoProps {
  fullName: string;
  setFullName: (val: string) => void;
  dateOfBirth: string;
  setDateOfBirth: (val: string) => void;
  gender: "Male" | "Female" | "Other";
  setGender: (val: "Male" | "Female" | "Other") => void;
  photos: File[];
  setPhotos: (files: File[]) => void;
   isDark?: boolean;
}

export const StudentInfo: React.FC<StudentInfoProps & { isDark: boolean }> = ({
  fullName,
  setFullName,
  dateOfBirth,
  setDateOfBirth,
  gender,
  setGender,
  photos,
  setPhotos,
  isDark,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setPhotos(Array.from(e.target.files));
  };

  return (
    <>
      <h3 className={`font-semibold text-lg ${isDark ? "text-white" : "text-gray-800"}`}>Student Info</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput label="Full Name" value={fullName} onChange={setFullName} isDark={isDark} />
        <TextInput
        label="Date of Birth"
        type="date"
       value={dateOfBirth}
       onChange={setDateOfBirth}   
       isDark={isDark}
       />



        <SelectInput<"Male" | "Female" | "Other">
          label="Gender"
          value={gender}
          onChange={setGender}
          options={["Male", "Female", "Other"]}
          isDark={isDark} 
        />
        <div className="flex flex-col gap-2">
          <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-gray-700"}`}>
            Photos
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className={`w-full text-sm px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500
              ${isDark ? "bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400" : "bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500"}`}
          />
        </div>
      </div>
    </>
  );
};