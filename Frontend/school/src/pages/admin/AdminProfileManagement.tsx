import React, { useEffect, useState } from "react";
import {
  UpdateAdminProfile,
  Getadminprofilemanagement,
  CreateAddress,
  UpdateAddress,
  RequestpasswordOtp,
  verifyPasswordOtp,
  updatePassword
} from "../../services/authapi";
import { showToast } from "../../utils/toast";
import { TextInput } from "../../components/Form/TextInput";
import { FormLayout } from "../../components/Form/FormLayout";
import { SelectInput } from "../../components/Form/SelectInput";
import { useTheme } from "../../components/layout/ThemeContext";

// --- Custom Component: ProfileSection ---
const ProfileSection = ({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) => (
  <div className={`space-y-4 p-4 rounded-lg ${className}`}>
    <h3 className="text-xl font-semibold border-b pb-2">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
);


const DarkModeButton = ({ children, onClick, type = "button", className = "" }: { children: React.ReactNode; onClick?: (e: React.FormEvent | React.MouseEvent) => void; type?: "button" | "submit" | "reset", className?: string }) => (
  <button 
    type={type} 
    onClick={onClick} 
    className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${className}`}
  >
    {children}
  </button>
);

export function AdminProfileManagement() {
  const { isDark } = useTheme(); // Use your existing ThemeContext

  // --- PROFILE STATES ---
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"institute" | "admin">("admin");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");

  const [addressId, setAddressId] = useState<string | undefined>(undefined);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<{ url: string; filename: string }[]>([]);

  // --- PASSWORD UPDATE FLOW ---
  const [passwordStep, setPasswordStep] = useState<"request" | "verify" | "update">("request");
  const [otpToken, setOtpToken] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // --- Conditional Classes ---
  const bgClass = isDark ? "bg-[#121A21] text-slate-100" : "bg-slate-50 text-slate-900";
  const sectionBgClass = isDark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-gray-300 text-black";
  const inputBgClass = isDark ? "bg-slate-700 text-slate-100 placeholder-slate-400 border-slate-600" : "bg-white text-black placeholder-gray-500 border-gray-300";
  const buttonPrimaryClass = isDark ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white";

  // --- FETCH PROFILE ---
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await Getadminprofilemanagement();
        const profileData = res.profile ?? res.data?.profile ?? res.data;

        setProfile(profileData);
        setName(profileData.name || "");
        setEmail(profileData.email || "");
        setPhone(profileData.phone || "");
        setGender(profileData.gender || "");
        setDateOfBirth(profileData.dateOfBirth?.slice(0, 10) || "");
        setDesignation(profileData.designation || "");
        setDepartment(profileData.department || "");

        if (profileData.address) {
          setAddressId(profileData.address._id);
          setStreet(profileData.address.street || "");
          setCity(profileData.address.city || "");
          setState(profileData.address.state || "");
          setPincode(profileData.address.pincode || "");
        }

        if (profileData.photo && Array.isArray(profileData.photo)) {
          setExistingPhotos(profileData.photo);
        }
      } catch (err) {
        console.error(err);
        showToast("Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // --- HANDLE PROFILE SUBMIT ---
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?._id) return;

    setLoading(true);
    try {
      let finalAddressId = addressId;
      if (street || city || state || pincode) {
        if (addressId) {
          await UpdateAddress(addressId, street, city, state, pincode);
        } else {
          const newAddr = await CreateAddress({ street, city, state, pincode });
          finalAddressId = newAddr.address._id;
          setAddressId(finalAddressId);
        }
      }

      const updatedProfile = await UpdateAdminProfile(
        profile._id,
        name,
        email,
        phone,
        gender,
        dateOfBirth,
        finalAddressId,
        documentFiles,
        photoFiles
      );

      setProfile(updatedProfile.profile ?? updatedProfile);
      if (updatedProfile.profile?.photo) setExistingPhotos(updatedProfile.profile.photo);
      showToast("Profile updated successfully!", "success");
    } catch (error:any) {
   

  let message = "Operation failed";
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    } else if (typeof error === "string") {
      message = error;
    }

    
    showToast(message, "error");

  showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  // --- PASSWORD FLOW ---
  const handleRequestOtp = async () => {
    try {
      const res = await RequestpasswordOtp(email);
      setOtpToken(res.otpToken);
      setPasswordStep("verify");
      showToast("OTP sent to your email", "success");
    } catch (error:any) {
      let message = "Operation failed";
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    } else if (typeof error === "string") {
      message = error;
    }
  
    showToast(message, "error");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await verifyPasswordOtp(otpToken, otp);
      setPasswordStep("update");
      showToast("OTP verified", "success");
    } catch (error:any) {
            let message = "Operation failed";
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    } else if (typeof error === "string") {
      message = error;
    }

    // --- SHOW THE MESSAGE ---
    showToast(message, "error");
    }
  };

 const handleUpdatePassword = async () => {
  if (!newPassword) return showToast("Enter new password", "error");
  if (!profile?._id) return showToast("Profile ID missing", "error");

  try {
    await updatePassword(profile._id, newPassword);
    showToast("Password updated successfully", "success");

    setPasswordStep("request");
    setOtp("");
    setNewPassword("");
    setOtpToken("");
  } catch (error: any) {
    // --- Extract proper message from backend ---
    let message = "Operation failed";
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    } else if (typeof error === "string") {
      message = error;
    }

    // --- SHOW THE MESSAGE ---
    showToast(message, "error");
  }
};


  return (
    <div className={`min-h-screen p-8 ${bgClass} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex justify-between items-start pb-4 border-b border-blue-600">
          <div>
            <h1 className="text-3xl font-extrabold">Profile Management</h1>
            <p className="text-sm text-slate-400">Manage your school's profile and administrative settings</p>
          </div>
         <div className="flex flex-col items-center">
  <div className="w-40 h-40 rounded-lg overflow-hidden border-2 border-blue-600 bg-gray-700 flex items-center justify-center">
    {existingPhotos.length > 0 ? (
      <img
        src={existingPhotos[0].url}
        alt="Admin Photo"
        className="w-full h-full object-cover"
      />
    ) : (
      <span className="text-gray-400 text-sm">No Photo</span>
    )}
  </div>
  <p className="text-xl font-bold mt-2 text-white">Logo</p>
</div>

        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-700">
          
          <button
            onClick={() => setActiveTab("admin")}
            className={`pb-2 transition duration-200 font-medium ${
              activeTab === "admin"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Admin Profile
          </button>
        </div>

        {/* --- Admin Profile Form --- */}
        {activeTab === "admin" && (
          <FormLayout onSubmit={handleProfileSubmit} isSubmitting={loading} className="space-y-8">
            
            {/* Personal Information */}
            <ProfileSection title="Personal Information" className={sectionBgClass}>
              <TextInput label="Name" value={name} onChange={setName} placeholder="Name" className={inputBgClass}  />
              <TextInput label="Date of Birth" value={dateOfBirth} onChange={setDateOfBirth} type="date" className={inputBgClass} />
              <SelectInput label="Gender" value={gender} onChange={setGender} options={["Male", "Female", "Other"]} className={inputBgClass}  />
              <TextInput label="Phone" value={phone} onChange={setPhone} placeholder="Phone" className={inputBgClass} />
              <TextInput label="Email" value={email} onChange={setEmail} placeholder="Email" type="email" className={inputBgClass}  />
            </ProfileSection>

            <div className="w-full h-px bg-gray-700" />

           

            <div className="w-full h-px bg-gray-700" />

            {/* Address Information */}
            <ProfileSection title="Address Information" className={sectionBgClass}>
              <TextInput label="Street" value={street} onChange={setStreet} placeholder="Street Address" className={inputBgClass} />
              <TextInput label="City" value={city} onChange={setCity} placeholder="City" className={inputBgClass} />
              <TextInput label="State" value={state} onChange={setState} placeholder="State" className={inputBgClass} />
              <TextInput label="Pincode" value={pincode} onChange={setPincode} placeholder="Pincode" className={inputBgClass} />
            </ProfileSection>

            <div className="w-full h-px bg-gray-700" />

            {/* Files & Documents */}
            <ProfileSection title="Files & Documents" className={sectionBgClass}>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Upload Photos</label>
                <input type="file" multiple onChange={(e) => e.target.files && setPhotoFiles(Array.from(e.target.files))} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600" />
                <div className="flex space-x-2 mt-2 mb-4">
                  {existingPhotos.map((photo, index) => (
                    <div key={index} className="w-16 h-16 rounded overflow-hidden border border-gray-600">
                      <img src={photo.url} alt={photo.filename} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Upload Documents</label>
                <input type="file" multiple onChange={(e) => e.target.files && setDocumentFiles(Array.from(e.target.files))} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600" />
              </div>
            </ProfileSection>

            {/* <div className="flex justify-center pt-4">
              <DarkModeButton type="submit" className="w-1/2">{loading ? "Updating..." : "Update Profile"}</DarkModeButton>
            </div> */}
          </FormLayout>
        )}

        {/* --- Password Update --- */}
        <div className={`mt-8 p-6 border rounded-lg shadow-xl ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-300"} space-y-4`}>
          <h2 className="text-xl font-bold">Security & Settings</h2>
          
          <div className="space-y-4 max-w-md">
            {passwordStep === "request" && (
              <div className="space-y-2">
                <p className="text-slate-300">Click below to start the password change process and send an OTP to your email ({email}).</p>
                <DarkModeButton onClick={handleRequestOtp} className="bg-red-600 hover:bg-red-700">Request OTP</DarkModeButton>
              </div>
            )}

            {passwordStep === "verify" && (
              <div className="space-y-2">
                <TextInput label="Enter OTP" value={otp} onChange={setOtp} placeholder="6-digit OTP" type="text" className={inputBgClass} />
                <DarkModeButton onClick={handleVerifyOtp} className="bg-red-600 hover:bg-red-700">Verify OTP</DarkModeButton>
              </div>
            )}

            {passwordStep === "update" && (
              <div className="space-y-2">
                <TextInput label="Enter New Password" value={newPassword} onChange={setNewPassword} placeholder="New Password" type="password" className={inputBgClass} />
                <DarkModeButton onClick={handleUpdatePassword} className="bg-red-600 hover:bg-red-700">Update Password</DarkModeButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
