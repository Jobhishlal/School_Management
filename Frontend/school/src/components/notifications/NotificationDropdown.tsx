import { useParentNotifications } from '../../hooks/useParentNotifications';
import { useNavigate } from 'react-router-dom';
import { Bell, DollarSign, Video, CheckCheck, Megaphone } from 'lucide-react';
import { useTheme } from '../layout/ThemeContext';

interface Props {
    onClose: () => void;
}

export const NotificationDropdown = ({ onClose }: Props) => {
    const { notifications, markAsRead, markAllAsRead } = useParentNotifications();
    const navigate = useNavigate();
    const { isDark } = useTheme();

    const getIcon = (type: string) => {
        switch (type) {
            case 'MEETING': return <Video size={16} className="text-blue-500" />;
            case 'FINANCE': return <DollarSign size={16} className="text-yellow-500" />;
            case 'PAYMENT': return <CheckCheck size={16} className="text-emerald-500" />;
            case 'ANNOUNCEMENT': return <Megaphone size={16} className="text-purple-500" />;
            default: return <Bell size={16} />;
        }
    };

    const bgColor = isDark ? 'bg-slate-800' : 'bg-white';
    const borderColor = isDark ? 'border-slate-700' : 'border-gray-200';
    const textColor = isDark ? 'text-white' : 'text-slate-900';
    const secondaryText = isDark ? 'text-slate-400' : 'text-slate-600';
    const hoverBg = isDark ? 'hover:bg-slate-750' : 'hover:bg-gray-50';
    const unreadBg = isDark ? 'bg-slate-700/30' : 'bg-blue-50';

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40"
                onClick={onClose}
            />

            {/* Dropdown */}
            <div className={`absolute right-0 top-12 w-80 ${bgColor} rounded-lg shadow-xl border ${borderColor} z-50 max-h-[500px] flex flex-col`}>
                {/* Header */}
                <div className={`p-4 border-b ${borderColor} flex justify-between items-center`}>
                    <h3 className={`font-semibold ${textColor}`}>Notifications</h3>
                    <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        Mark all read
                    </button>
                </div>

                {/* Notification List */}
                <div className="overflow-y-auto flex-1">
                    {notifications.length === 0 ? (
                        <div className={`p-8 text-center ${secondaryText}`}>
                            <Bell size={32} className="mx-auto mb-2 opacity-50" />
                            <p>No notifications</p>
                        </div>
                    ) : (
                        notifications.map(notif => (
                            <div
                                key={notif.id}
                                onClick={() => {
                                    markAsRead(notif.id);
                                    if (notif.link) navigate(notif.link);
                                    onClose();
                                }}
                                className={`p-4 border-b ${borderColor} ${hoverBg} cursor-pointer transition-colors ${!notif.read ? unreadBg : ''
                                    }`}
                            >
                                <div className="flex gap-3">
                                    <div className="mt-1">{getIcon(notif.type)}</div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`font-medium text-sm ${textColor} truncate`}>{notif.title}</h4>
                                        <p className={`text-xs ${secondaryText} mt-1 line-clamp-2`}>{notif.content}</p>
                                        <span className={`text-xs ${secondaryText} mt-2 block`}>
                                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    {!notif.read && (
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};
