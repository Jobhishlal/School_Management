import React, { useEffect, useState } from "react";
import { getParentProfile } from "../../services/authapi";
import { useTheme } from "../../components/layout/ThemeContext";
import { getDecodedToken } from "../../utils/DecodeToken";
import {
  Loader2,
  User,
  MapPin,
  GraduationCap,
} from "lucide-react";
import type { ParentProfileDTO } from "../../types/ParentProfileDTO";


const ParentProfile: React.FC = () => {
  const { isDark } = useTheme();
  const [profile, setProfile] = useState<ParentProfileDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const decoded = getDecodedToken();

        if (!decoded?.id) {
          setError("User authentication failed.");
          return;
        }

        const data = await getParentProfile(decoded.id);
        console.log(data)

        // console.log("PROFILE FROM API:", data.profile);
        // console.log("data",data)

        setProfile(data.profile);
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );

  if (error)
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );

  if (!profile) return null;

  const cardClass = `rounded-xl p-6 shadow-lg border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
    }`;

  const textPrimary = isDark ? "text-slate-100" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <div
      className={`min-h-screen p-6 ${isDark ? "bg-[#121A21]" : "bg-slate-50"
        }`}
    >
      <h1 className={`text-2xl font-bold mb-8 ${textPrimary}`}>
        My Profile
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Parent Details */}
        <div className={cardClass}>
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <User className="h-6 w-6 text-blue-500" />
            <h2 className={`text-lg font-semibold ${textPrimary}`}>
              Parent Details
            </h2>
          </div>
          <div className="space-y-3">
            <p className={textPrimary}>
              <span className={textSecondary}>Name: </span>
              {profile.parent?.name ?? "N/A"}
            </p>
            <p className={textPrimary}>
              <span className={textSecondary}>Relationship: </span>
              {profile.parent?.relationship ?? "N/A"}
            </p>
            <p className={textPrimary}>
              <span className={textSecondary}>Email: </span>
              {profile.parent?.email ?? "N/A"}
            </p>
            <p className={textPrimary}>
              <span className={textSecondary}>Contact: </span>
              {profile.parent?.contactNumber ?? "N/A"}
            </p>
            <p className={textPrimary}>
              <span className={textSecondary}>WhatsApp: </span>
              {profile.parent?.whatsappNumber ?? "N/A"}
            </p>
          </div>
        </div>

        {/* Student Details */}
        <div className={cardClass}>
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <GraduationCap className="h-6 w-6 text-green-500" />
            <h2 className={`text-lg font-semibold ${textPrimary}`}>
              Student Details
            </h2>
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="h-20 w-20 rounded-full overflow-hidden bg-slate-300">
              {profile.student?.photo ? (
                <img
                  src={profile.student.photo}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-xl">
                  {profile.student?.fullName?.charAt(0)}
                </div>
              )}
            </div>

            <p className={`text-xl font-bold ${textPrimary}`}>
              {profile.student?.fullName}
            </p>
            <p className={textSecondary}>ID: {profile.student?.studentId}</p>
          </div>

          <p className={textPrimary}>
            <span className={textSecondary}>Class: </span>
            {profile.student?.classDetails
              ? `${profile.student.classDetails.className} - ${profile.student.classDetails.division}`
              : "N/A"}
          </p>

          <p className={textPrimary}>
            <span className={textSecondary}>Gender: </span>
            {profile.student?.gender}
          </p>

          <p className={textPrimary}>
            <span className={textSecondary}>DOB: </span>
            {new Date(profile.student?.dob).toLocaleDateString()}
          </p>
        </div>

        {/* Address */}
        <div className={cardClass}>
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <MapPin className="h-6 w-6 text-red-500" />
            <h2 className={`text-lg font-semibold ${textPrimary}`}>
              Address
            </h2>
          </div>

          {profile.address ? (
            <div className="space-y-3">
              <p className={textPrimary}>{profile.address.street}</p>
              <p className={textPrimary}>
                {profile.address.city}, {profile.address.state}
              </p>
              <p className={textPrimary}>{profile.address.pincode}</p>
            </div>
          ) : (
            <p className={textSecondary}>No address available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentProfile;
