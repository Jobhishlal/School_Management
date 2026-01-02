import React, { useEffect, useState } from "react";
import { getParentProfile } from "../../services/authapi";
import { useTheme } from "../../components/layout/ThemeContext";
import { getDecodedToken } from "../../utils/DecodeToken";
import { Loader2, User, Phone, Mail, MapPin, GraduationCap, Calendar, Users } from "lucide-react";

interface ParentProfileDTO {
    parent: {
        id: string;
        name: string;
        email: string;
        contactNumber: string;
        whatsappNumber: string;
        relationship?: string;
    };
    student: {
        id: string;
        fullName: string;
        studentId: string;
        dob: string;
        gender: string;
        photo?: string;
        classDetails?: {
            className: string;
            division: string;
            rollNumber?: string;
        };
    };
    address?: {
        street: string;
        city: string;
        state: string;
        pincode: string;
    };
}

const ParentProfile: React.FC = () => {
    const { isDark } = useTheme();
    const [profile, setProfile] = useState<ParentProfileDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const decoded = getDecodedToken();
                if (!decoded || !decoded.id) {
                    setError("User authentication failed.");
                    setLoading(false);
                    return;
                }

                const data = await getParentProfile(decoded.id);
                setProfile(data);
            } catch (err: any) {
                console.error("Error fetching profile:", err);
                setError(err.response?.data?.message || err.message || "Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    if (!profile) return null;

    const cardClass = `rounded-xl p-6 shadow-lg border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`;
    const textPrimary = isDark ? "text-slate-100" : "text-slate-900";
    const textSecondary = isDark ? "text-slate-400" : "text-slate-500";

    return (
        <div className={`min-h-screen p-6 ${isDark ? "bg-[#121A21]" : "bg-slate-50"}`}>
            <h1 className={`text-2xl font-bold mb-8 ${textPrimary}`}>My Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Parent Details */}
                <div className={cardClass}>
                    <div className="flex items-center gap-3 mb-6 border-b pb-4 border-slate-700/50">
                        <User className="h-6 w-6 text-blue-500" />
                        <h2 className={`text-lg font-semibold ${textPrimary}`}>Parent Details</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className={`text-sm ${textSecondary}`}>Name</p>
                            <p className={`font-medium ${textPrimary}`}>{profile.parent.name}</p>
                        </div>
                        <div>
                            <p className={`text-sm ${textSecondary}`}>Relationship</p>
                            <p className={`font-medium ${textPrimary}`}>{profile.parent.relationship || "N/A"}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail size={16} className="text-slate-400" />
                            <div>
                                <p className={`text-sm ${textSecondary}`}>Email</p>
                                <p className={`font-medium ${textPrimary}`}>{profile.parent.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={16} className="text-slate-400" />
                            <div>
                                <p className={`text-sm ${textSecondary}`}>Contact</p>
                                <p className={`font-medium ${textPrimary}`}>{profile.parent.contactNumber}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users size={16} className="text-slate-400" />
                            <div>
                                <p className={`text-sm ${textSecondary}`}>WhatsApp</p>
                                <p className={`font-medium ${textPrimary}`}>{profile.parent.whatsappNumber}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Student Details */}
                <div className={cardClass}>
                    <div className="flex items-center gap-3 mb-6 border-b pb-4 border-slate-700/50">
                        <GraduationCap className="h-6 w-6 text-green-500" />
                        <h2 className={`text-lg font-semibold ${textPrimary}`}>Student Details</h2>
                    </div>

                    <div className="flex flex-col items-center mb-6">
                        <div className="h-20 w-20 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-3">
                            {profile.student.photo ? (
                                <img src={profile.student.photo} alt="Student" className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-slate-400">
                                    {profile.student.fullName.charAt(0)}
                                </div>
                            )}
                        </div>
                        <p className={`text-xl font-bold ${textPrimary}`}>{profile.student.fullName}</p>
                        <p className={`text-sm ${textSecondary}`}>ID: {profile.student.studentId}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className={`text-sm ${textSecondary}`}>Class</p>
                                <p className={`font-medium ${textPrimary}`}>
                                    {profile.student.classDetails ? `${profile.student.classDetails.className} - ${profile.student.classDetails.division}` : "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className={`text-sm ${textSecondary}`}>Gender</p>
                                <p className={`font-medium ${textPrimary}`}>{profile.student.gender}</p>
                            </div>
                        </div>

                        <div>
                            <p className={`text-sm ${textSecondary}`}>Date of Birth</p>
                            <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-slate-400" />
                                <p className={`font-medium ${textPrimary}`}>
                                    {new Date(profile.student.dob).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div className={cardClass}>
                    <div className="flex items-center gap-3 mb-6 border-b pb-4 border-slate-700/50">
                        <MapPin className="h-6 w-6 text-red-500" />
                        <h2 className={`text-lg font-semibold ${textPrimary}`}>Address</h2>
                    </div>
                    {profile.address ? (
                        <div className="space-y-4">
                            <div>
                                <p className={`text-sm ${textSecondary}`}>Street</p>
                                <p className={`font-medium ${textPrimary}`}>{profile.address.street}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className={`text-sm ${textSecondary}`}>City</p>
                                    <p className={`font-medium ${textPrimary}`}>{profile.address.city}</p>
                                </div>
                                <div>
                                    <p className={`text-sm ${textSecondary}`}>State</p>
                                    <p className={`font-medium ${textPrimary}`}>{profile.address.state}</p>
                                </div>
                            </div>
                            <div>
                                <p className={`text-sm ${textSecondary}`}>Pincode</p>
                                <p className={`font-medium ${textPrimary}`}>{profile.address.pincode}</p>
                            </div>
                        </div>
                    ) : (
                        <p className={`italic ${textSecondary}`}>No address information available.</p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ParentProfile;
