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

        const newSocket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:5000', {
            withCredentials: true
        });

        newSocket.on('connect', () => {
            console.log("Connected to socket");
            if (userId) {
                newSocket.emit('join_chat', userId);
            }
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return socket;
};
