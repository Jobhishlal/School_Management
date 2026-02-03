import React from "react";
import { TextInput } from "../TextInput";


interface InstituteProfile {
  institutename: string;
  setinstitutename: (val: string) => void;
  contact: string;
  setcontact: (val: string) => void;
  email: string
  setemail: (val: string) => void;
  phone: string
  setphone: (val: string) => void;
  principlename: string;
  setprinciplename: (val: string) => void;
  logo: File[]
  setlogo: (files: File[]) => void;
  isDark?: boolean;
}

export const InstituteProfile: React.FC<InstituteProfile & { isDark: boolean }> = ({
  institutename,
  setinstitutename,
  contact,
  setcontact,
  email,
  setemail,
  phone,
  setphone,
  principlename,
  setprinciplename,
  
  setlogo,
  isDark,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;


    const selectedFiles = Array.from(e.target.files);


    const images = selectedFiles.filter(file => file.type.startsWith("image/"));

    setlogo(images);
  };


  return (
    <>
      <h3 className={`font-semibold text-lg ${isDark ? "text-white" : "text-gray-800"}`}>Institute Info</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput label="Institute Name" value={institutename} onChange={setinstitutename} isDark={isDark} />
        <TextInput
          label="lanphone"

          value={contact}
          onChange={setcontact}
          isDark={isDark}
        />
        <TextInput
          label="email"
          type="email"
          value={email}
          onChange={setemail}
          isDark={isDark}
        />
        <TextInput
          label="phone"

          value={phone}
          onChange={setphone}
          isDark={isDark}
        />
        <TextInput
          label="principle Name"

          value={principlename}
          onChange={setprinciplename}
          isDark={isDark}
        />




        <div className="flex flex-col gap-2">
          <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-gray-700"}`}>
            Photos
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />

        </div>
      </div>
    </>
  );
};