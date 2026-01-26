import React, { useEffect, useState } from 'react';
import { getScheduledMeetings } from '../../services/authapi';
import { Video, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useTheme } from '../../components/layout/ThemeContext';

interface Meeting {
    _id: string;
    title: string;
    description: string;
    link: string;
    type: string;
    startTime: Date;
    managedBy: string;
}

export const MeetingList: React.FC = () => {
    const { isDark } = useTheme();
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const res = await getScheduledMeetings();

                if (res.success) {
                    setMeetings(res.data);
                } else if (res.data && res.data.success) {
                    setMeetings(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch meetings", error);
            } finally {
                setLoading(false);
            }
        }
        fetchMeetings();
    }, []);

    const joinMeeting = (link: string) => {
        navigate(`/meeting/${link}`);
    }

    if (loading) return <div className={`p-4 text-center ${isDark ? "text-slate-400" : "text-gray-600"}`}>Loading Meetings...</div>;

    if (meetings.length === 0) return (
        <div className={`p-6 rounded-xl shadow-sm border text-center ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}`}>
            <Video className={`mx-auto h-12 w-12 mb-3 ${isDark ? "text-slate-600" : "text-gray-400"}`} />
            <h3 className={`text-lg font-medium ${isDark ? "text-white" : "text-gray-900"}`}>No Upcoming Meetings</h3>
            <p className={`mt-1 ${isDark ? "text-slate-400" : "text-gray-500"}`}>You don't have any scheduled video conferences.</p>
        </div>
    );

    return (
        <div className="space-y-4">
            <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-gray-800"}`}>
                <Video className="text-blue-500" /> Upcoming Video Conferences
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {meetings.map((meeting) => (
                    <div key={meeting._id} className={`p-5 rounded-xl shadow-sm hover:shadow-md transition-all border relative overflow-hidden group 
                        ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}`}>
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wide 
                                    ${meeting.type === 'staff'
                                        ? (isDark ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700')
                                        : meeting.type === 'parent'
                                            ? (isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700')
                                            : (isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700')
                                    }`}>
                                    {meeting.type} Meeting
                                </span>
                            </div>
                        </div>

                        <h3 className={`text-lg font-bold mb-2 line-clamp-1 ${isDark ? "text-white" : "text-gray-900"}`} title={meeting.title}>
                            {meeting.title}
                        </h3>

                        <div className={`space-y-2 text-sm mb-4 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className={isDark ? "text-slate-500" : "text-gray-400"} />
                                <span>{dayjs(meeting.startTime).format('MMMM D, YYYY')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} className={isDark ? "text-slate-500" : "text-gray-400"} />
                                <span>{dayjs(meeting.startTime).format('h:mm A')}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => joinMeeting(meeting.link)}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 active:scale-95"
                        >
                            <Video size={18} />
                            Join Meeting
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
