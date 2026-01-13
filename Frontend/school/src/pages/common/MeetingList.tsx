import React, { useEffect, useState } from 'react';
import { getScheduledMeetings } from '../../services/authapi';
import { Video, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

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

    if (loading) return <div className="p-4 text-center">Loading Meetings...</div>;

    if (meetings.length === 0) return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
            <Video className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Upcoming Meetings</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">You don't have any scheduled video conferences.</p>
        </div>
    );

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Video className="text-blue-500" /> Upcoming Video Conferences
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {meetings.map((meeting) => (
                    <div key={meeting._id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wide 
                                    ${meeting.type === 'staff' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                                        meeting.type === 'parent' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                                    {meeting.type} Meeting
                                </span>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1" title={meeting.title}>
                            {meeting.title}
                        </h3>

                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-gray-400" />
                                <span>{dayjs(meeting.startTime).format('MMMM D, YYYY')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-gray-400" />
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
