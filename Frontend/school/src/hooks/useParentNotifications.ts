import { useState, useEffect } from 'react';
import { useSocket } from './useSocket';

export interface Notification {
    id: string;
    title: string;
    content: string;
    type: 'MEETING' | 'FINANCE' | 'PAYMENT' | 'ANNOUNCEMENT';
    link?: string;
    read: boolean;
    createdAt: Date;
}

export const useParentNotifications = () => {
    const socket = useSocket();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!socket) return;

        const handleNotification = (data: any) => {
            const newNotification: Notification = {
                id: Date.now().toString(),
                title: data.title,
                content: data.content,
                type: data.type,
                link: data.link,
                read: false,
                createdAt: new Date()
            };

            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
        };

        socket.on('notification:new', handleNotification);

        return () => {
            socket.off('notification:new', handleNotification);
        };
    }, [socket]);

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    return { notifications, unreadCount, markAsRead, markAllAsRead };
};
