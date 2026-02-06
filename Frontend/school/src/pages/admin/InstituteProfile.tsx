

import React, { useEffect, useState } from "react";
import {
  CreateAddress,
  CreateInstituteProfile,
  getInstituteProfile,
  UpdateAddress,
  UpdateInstituteProfile
} from "../../services/authapi";
import { showToast } from "../../utils/toast";
import { Edit2, Save, Lock } from "lucide-react";
import { useTheme } from "../../components/layout/ThemeContext";

export const InstituteManagementPage: React.FC = () => {
  const { isDark } = useTheme();

  const [institute, setInstitute] = useState<any>(null);
  const [loading, setLoading] = useState(false);


  const [instituteName, setInstituteName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [principalName, setPrincipalName] = useState("");
  const [logo, setLogo] = useState<File[]>([]);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [isEditing, setIsEditing] = useState(false);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setLogo(selectedFiles);
      setLogoPreview(URL.createObjectURL(selectedFiles[0]));
    }
  };


  useEffect(() => {
    const fetchInstitute = async () => {
      setLoading(true);
      try {
        const res = await getInstituteProfile();
        if (res?.institute?.length) {
          const inst = res.institute[0];
          setInstitute(inst);


          setInstituteName(inst.instituteName || "");
          setContact(inst.contactInformation || "");
          setEmail(inst.email || "");
          setPhone(inst.phone || "");
          setPrincipalName(inst.principalName || "");
          setStreet(inst.address?.street || "");
          setCity(inst.address?.city || "");
          setState(inst.address?.state || "");
          setPincode(inst.address?.pincode || "");

          if (inst.logo && inst.logo.length > 0 && inst.logo[0].url) {
            setLogoPreview(inst.logo[0].url);
          }

          setIsEditing(false);
        } else {
          setIsEditing(true);
        }
      } catch (error) {
        console.error("Failed to fetch institute:", error);
        setIsEditing(true);
      } finally {
        setLoading(false);
      }
    };
    fetchInstitute();
  }, []);


  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!institute) {

        const addressRes = await CreateAddress({ street, city, state, pincode });
        const addressId = addressRes.address?._id;
        if (!addressId) throw new Error("Failed to create address.");

        const instRes = await CreateInstituteProfile(
          instituteName,
          contact,
          email,
          phone,
          addressId,
          principalName,
          logo
        );
        showToast("Institute created successfully!", "success");
        setInstitute(instRes);
        setIsEditing(false);
      } else {
        // Update existing institute
        const addressId = typeof institute.address === 'string'
          ? institute.address
          : institute.address?._id;

        if (!addressId) {
          throw new Error("Address ID is missing. Please contact support.");
        }

        await UpdateAddress(addressId, street, city, state, pincode);

        await UpdateInstituteProfile(
          institute._id,
          instituteName,
          contact,
          email,
          phone,
          addressId,
          principalName,
          logo
        );
        showToast("Institute updated successfully!", "success");

        const res = await getInstituteProfile();
        if (res?.institute?.length > 0) setInstitute(res.institute[0]);
        setIsEditing(false);
      }
    } catch (error: any) {
      console.error(error);
      showToast(error.response?.data?.message || "Operation failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // Form field component
  const FormField = ({ label, value, setter, type = "text" }: { label: string; value: string; setter: (val: string) => void; type?: string }) => (
    <div className="relative">
      <label className="block text-sm font-medium mb-1 text-slate-300">{label}</label>
      <input
        type={type}
        className={`
          w-full px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm
          ${isEditing ?
            "bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400" :
            "bg-slate-800 border-slate-700 text-slate-300 pointer-events-none"
          }
        `}
        value={value}
        onChange={(e) => setter(e.target.value)}
        disabled={!isEditing}
      />
    </div>
  );

  return (
    <div className={`min-h-screen p-4 sm:p-8 ${isDark ? "bg-[#121A21] text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-1">Profile Management</h2>
        <p className="text-slate-400 mb-6">Manage your school's profile and administrative settings</p>

        <div className="flex border-b border-slate-700 mb-6">
          <div className="px-4 py-2 font-medium border-b-2 border-blue-500 text-blue-500">Institute Profile</div>

        </div>

        <div className={`rounded-lg p-6 shadow-xl ${isDark ? "bg-slate-800/50" : "bg-white"} relative`}>
          {institute && (
            <button
              onClick={() => setIsEditing(prev => !prev)}
              className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${isDark ? "hover:bg-slate-700" : "hover:bg-gray-100"} ${isEditing ? "text-red-400" : "text-blue-400"}`}
              title={isEditing ? "Disable Editing" : "Enable Editing"}
            >
              {isEditing ? <Lock size={20} /> : <Edit2 size={20} />}
            </button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <h3 className="text-xl font-semibold border-b border-slate-700 pb-2">Institute Profile</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Institute Name" value={instituteName} setter={setInstituteName} />
                <FormField label="Contact Information" value={contact} setter={setContact} />
                <FormField label="Email" value={email} setter={setEmail} type="email" />
                <FormField label="Phone" value={phone} setter={setPhone} type="tel" />
                <FormField label="Principal Name" value={principalName} setter={setPrincipalName} />
              </div>

              <h3 className="text-xl font-semibold border-b border-slate-700 pb-2 pt-4">Address Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Street" value={street} setter={setStreet} />
                <FormField label="City" value={city} setter={setCity} />
                <FormField label="State" value={state} setter={setState} />
                <FormField label="Pincode" value={pincode} setter={setPincode} />
              </div>
            </div>

            <div className="md:col-span-1 flex flex-col items-center space-y-6 pt-10 md:pt-0">
              <div className={`w-full max-w-xs p-4 rounded-lg text-center ${isDark ? "bg-slate-700/50" : "bg-gray-100"}`}>
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Institute Logo Preview"
                    className="w-full h-auto max-h-40 object-contain rounded-md mb-3 border border-slate-600"
                  />
                ) : (
                  <div className={`w-full h-40 flex items-center justify-center rounded-md mb-3 border border-dashed ${isDark ? "border-slate-600 text-slate-400" : "border-gray-400 text-gray-500"}`}>
                    <p>Logo Placeholder</p>
                  </div>
                )}

                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                  Logo Upload
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={!isEditing}
                  className={`block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:transition-colors ${isEditing ?
                    (isDark ? "text-slate-300 file:bg-slate-700 file:text-blue-400 hover:file:bg-slate-600" : "text-gray-500 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100") :
                    "opacity-50 pointer-events-none"
                    }`}
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <button
              className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={20} />
                  {institute ? "Update Institute Profile" : "Create Institute Profile"}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
