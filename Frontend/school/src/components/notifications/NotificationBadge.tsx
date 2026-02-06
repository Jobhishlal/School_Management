import { Bell } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useParentNotifications } from '../../hooks/useParentNotifications';
import { NotificationDropdown } from './NotificationDropdown';
import { useTheme } from '../layout/ThemeContext';

export const NotificationBadge = () => {
    const { unreadCount } = useParentNotifications();
    const [showDropdown, setShowDropdown] = useState(false);
    const { isDark } = useTheme();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const hoverBg = isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-200';

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`relative p-2 rounded-full ${hoverBg} transition-colors`}
                aria-label="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-bold px-1">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <NotificationDropdown onClose={() => setShowDropdown(false)} />
            )}
        </div>
    );
};
