import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        // Try to get token from teacher or student storage
        const token = localStorage.getItem('teacherAccessToken') || localStorage.getItem('studentAccessToken') || localStorage.getItem('accessToken');

        let userId: string | null = null;
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                userId = decoded.id || decoded.userId || decoded._id;
            } catch (e) {
                console.error("Token decode failed", e);
            }
        }

        // If VITE_SERVER_URL is relative (starts with /), use window.location.origin
        // This ensures the socket request hits https://domain.com/socket.io/ directly
        // matching the Nginx location /socket.io/ block.
        const socketUrl = import.meta.env.VITE_SERVER_URL?.startsWith('/')
            ? window.location.origin
            : (import.meta.env.VITE_SERVER_URL || 'http://localhost:5000');

        console.log("Initializing socket with URL:", socketUrl);

        const newSocket = io(socketUrl, {
            withCredentials: true,
            transports: ['websocket'],
            path: '/socket.io'
        });

        newSocket.on('connect', () => {
            console.log("Connected to socket");
            if (userId) {
                const role = localStorage.getItem('role');
                newSocket.emit('join_chat', { userId, role });
            }
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return socket;
};
