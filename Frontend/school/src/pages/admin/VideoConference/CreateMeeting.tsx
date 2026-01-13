import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTheme } from '../../../components/layout/ThemeContext';
import { classdivisonaccess, createMeeting, getScheduledMeetings } from '../../../services/authapi';
import { showToast } from '../../../utils/toast';
import { Copy } from 'lucide-react';
import dayjs from 'dayjs';

interface CreateMeetingForm {
    title: string;
    description: string;
    type: 'staff' | 'parent' | 'class';
    classId?: string;
    startTime: string;
}

const CreateMeeting: React.FC = () => {
    const { isDark } = useTheme();
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<CreateMeetingForm>();
    const [classes, setClasses] = useState<any[]>([]);
    const [createdLink, setCreatedLink] = useState<string | null>(null);
    const [meetings, setMeetings] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const meetingType = watch('type');

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                // classdivisonaccess returns full Axios response based on authapi inspection
                if (res.data.success) {
                    // Flatten classes/divisions
                    const classList: any[] = [];
                    Object.values(res.data.data).forEach((c: any) => {
                        classList.push(c);
                    });
                    setClasses(classList);
                }
            } catch (error) {
                console.error("Error fetching classes", error);
            }
        };
        fetchClasses();
        loadMeetings();
    }, []);

    const loadMeetings = async () => {
        try {
            const res = await getScheduledMeetings();
            if (res.success) {
                setMeetings(res.data);
            }
        } catch (error) {
            console.error("Error fetching meetings", error);
        }
    };

    const onSubmit = async (data: CreateMeetingForm) => {
        setLoading(true);
        try {
            const res = await createMeeting(data);
            if (res.success) {
                const link = `${window.location.origin}/meeting/${res.data.link}`;
                setCreatedLink(link);
                showToast('Meeting created successfully!', 'success');
                reset();
                loadMeetings();
            } else {
                showToast('Failed to create meeting', 'error');
            }
        } catch (error) {
            showToast('Error creating meeting', 'error');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (createdLink) {
            navigator.clipboard.writeText(createdLink);
            showToast('Link copied to clipboard', 'success');
        }
    };

    return (
        <div className={`min-h-screen p-8 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <h1 className="text-3xl font-bold mb-6">Video Conference Management</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Create Meeting Form */}
                <div className={`p-6 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                    <h2 className="text-xl font-semibold mb-4">Create New Meeting</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                                {...register('title', { required: 'Title is required' })}
                                className={`w-full p-2 rounded border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                            />
                            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                {...register('description')}
                                className={`w-full p-2 rounded border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <select
                                {...register('type', { required: true })}
                                className={`w-full p-2 rounded border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                            >
                                <option value="staff">Staff Meeting (Admin + Teachers)</option>
                                <option value="parent">Parent Meeting (All Parents)</option>
                                <option value="class">Class Meeting (Specific Class Parents)</option>
                            </select>
                        </div>

                        {meetingType === 'class' && (
                            <div>
                                <label className="block text-sm font-medium mb-1">Select Class</label>
                                <select
                                    {...register('classId', { required: 'Class is required for class meetings' })}
                                    className={`w-full p-2 rounded border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                                >
                                    <option value="">Select a Class</option>
                                    {classes.map((cls) => (
                                        <option key={cls.classId} value={cls.classId}>
                                            {cls.className} - {cls.division}
                                        </option>
                                    ))}
                                </select>
                                {errors.classId && <p className="text-red-500 text-sm">{errors.classId.message}</p>}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-1">Start Time</label>
                            <input
                                type="datetime-local"
                                {...register('startTime', { required: 'Start time is required' })}
                                className={`w-full p-2 rounded border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Meeting'}
                        </button>
                    </form>

                    {createdLink && (
                        <div className={`mt-6 p-4 rounded border ${isDark ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'}`}>
                            <p className="font-semibold mb-2">Meeting Created!</p>
                            <div className="flex items-center gap-2">
                                <input
                                    readOnly
                                    value={createdLink}
                                    className={`flex-1 p-2 rounded border ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'}`}
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className="p-2 bg-gray-200 dark:bg-gray-700 rounded hover:opacity-80"
                                >
                                    <Copy size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Scheduled Meetings List */}
                <div className={`p-6 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                    <h2 className="text-xl font-semibold mb-4">Scheduled Meetings</h2>
                    <div className="space-y-4">
                        {meetings.map((meeting) => (
                            <div key={meeting._id} className={`p-4 rounded border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold">{meeting.title}</h3>
                                        <p className="text-sm opacity-75">{dayjs(meeting.startTime).format('MMM D, YYYY h:mm A')}</p>
                                        <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${meeting.type === 'staff' ? 'bg-purple-100 text-purple-800' :
                                            meeting.type === 'parent' ? 'bg-blue-100 text-blue-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                            {meeting.type.toUpperCase()}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => window.open(`/meeting/${meeting.link}`, '_blank')}
                                        className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                                    >
                                        Start
                                    </button>
                                </div>
                            </div>
                        ))}
                        {meetings.length === 0 && <p className="opacity-50">No scheduled meetings.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateMeeting;
