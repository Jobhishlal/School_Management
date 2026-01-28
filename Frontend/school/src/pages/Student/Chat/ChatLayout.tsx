import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../../components/layout/ThemeContext';
import { getConversations, type Conversation, type ChatUser } from '../../../services/ChatService';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import { io, Socket } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';

export default function ChatLayout() {
    const { isDark } = useTheme();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
    const [currentUserId, setCurrentUserId] = useState<string>('');
    const selectedUserRef = useRef<ChatUser | null>(null);

    useEffect(() => {
        selectedUserRef.current = selectedUser;
        // When user selects a chat, clear its unread count locally
        if (selectedUser) {
            setConversations(prev => prev.map(c => {
                let isMatch = false;
                if (c.isGroup && selectedUser.isGroup && c._id === selectedUser._id) isMatch = true;
                if (!c.isGroup && !selectedUser.isGroup) {
                    // Check participant
                    isMatch = c.participants.some(p => {
                        const pId = (p.participantId as any)._id || p.participantId;
                        return String(pId) === String(selectedUser._id);
                    });
                }

                if (isMatch) {
                    return { ...c, unreadCount: 0 };
                }
                return c;
            }));
        }
    }, [selectedUser]);

    // Initialize Socket
    useEffect(() => {
        const token = localStorage.getItem('studentAccessToken');
        let userId: string | null = null;
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                userId = decoded.id || decoded.userId || decoded._id;
                setCurrentUserId(userId || '');
            } catch (e) {
                console.error("Token decode failed", e);
            }
        }

        const newSocket = io('http://localhost:5000', {
            withCredentials: true
        });

        newSocket.on('connect', () => {
            // ...
            if (userId) {
                newSocket.emit('join_chat', userId);
            }
        });

        // ... (rest of socket logic same)

        newSocket.on('online_users', (users: string[]) => {
            setOnlineUsers(new Set(users));
        });

        newSocket.on('user_online', (uid: string) => {
            setOnlineUsers(prev => {
                const newSet = new Set(prev);
                newSet.add(uid);
                return newSet;
            });
        });

        newSocket.on('user_offline', (uid: string) => {
            setOnlineUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(uid);
                return newSet;
            });
        });

        newSocket.on('receive_message', (message: any) => {
            setConversations(prev => {
                const existingIdx = prev.findIndex(c => c._id === (message.receiverModel === 'Conversation' ? message.receiverId : message.senderId));
                if (existingIdx === -1) {
                    fetchConversations();
                    return prev;
                }

                const updatedConv = { ...prev[existingIdx], lastMessage: message };
                const newConvs = [...prev];
                newConvs.splice(existingIdx, 1);
                newConvs.unshift(updatedConv);
                return newConvs;
            });
        });

        newSocket.on('receive_private_message', (message: any) => {
            setConversations(prev => {
                const isGroupMsg = message.receiverModel === 'Conversation';
                const otherUserId = message.senderId === (userId || currentUserId) ? message.receiverId : message.senderId;

                let existingIdx = -1;

                if (isGroupMsg) {
                    existingIdx = prev.findIndex(c => c._id === message.receiverId);
                } else {
                    existingIdx = prev.findIndex(c =>
                        !c.isGroup &&
                        c.participants.some(p => {
                            const pId = (p.participantId as any)._id || p.participantId;
                            return String(pId) === String(otherUserId);
                        })
                    );
                }

                const isCurrentChat = isGroupMsg
                    ? selectedUserRef.current?._id === message.receiverId
                    : selectedUserRef.current?._id === otherUserId;

                // If it's my own message, don't increment unread
                // If it's incoming message:
                //   - If I am viewing this chat (isCurrentChat), unread = 0 (or keep existing 0)
                //   - If I am NOT viewing this chat, increment unread
                const shouldIncrement = message.senderId !== (userId || currentUserId) && !isCurrentChat;

                if (existingIdx !== -1) {
                    const currentUnread = prev[existingIdx].unreadCount || 0;
                    const updatedConv = {
                        ...prev[existingIdx],
                        lastMessage: message,
                        updatedAt: new Date().toISOString(),
                        unreadCount: shouldIncrement ? currentUnread + 1 : currentUnread
                    };
                    const newConvs = [...prev];
                    newConvs.splice(existingIdx, 1);
                    newConvs.unshift(updatedConv);
                    return newConvs;
                } else {
                    fetchConversations();
                    return prev;
                }
            });
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        }
    }, []);

    const fetchConversations = async () => {
        try {
            const data = await getConversations();
            const rawConversations = Array.isArray(data) ? data : [];

            // Deduplicate conversations (Frontend Side Clean-up)
            const uniqueMap = new Map();
            rawConversations.forEach(c => {
                let key;
                if (c.isGroup) {
                    key = c._id;
                } else {
                    // For private chat, key is the Other User ID
                    const other = c.participants.find((p: any) => {
                        // Robust ID access
                        const pId = (p.participantId && (p.participantId._id || p.participantId)) || '';
                        return String(pId) !== String(currentUserId);
                    });
                    key = other ? (other.participantId._id || other.participantId) : c._id;
                }

                if (!uniqueMap.has(key)) {
                    uniqueMap.set(key, c);
                }
            });

            setConversations(Array.from(uniqueMap.values()).sort((a: any, b: any) => {
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            }));
        } catch (error) {
            console.error("Failed to load conversations", error);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    return (
        <div className={`flex h-[calc(100vh-2rem)] rounded-2xl overflow-hidden border ${isDark ? 'bg-[#121A21] border-slate-700' : 'bg-white border-slate-200'} shadow-xl`}>
            <ChatSidebar
                conversations={conversations}
                selectedUser={selectedUser}
                onSelectUser={setSelectedUser}
                isDark={isDark}
                onlineUsers={onlineUsers}
                currentUserId={currentUserId}
            />
            {selectedUser ? (
                <div className="flex-1 min-w-0">
                    <ChatWindow
                        teacher={selectedUser}
                        isDark={isDark}
                        socket={socket}
                    />
                </div>
            ) : (
                <div className={`flex-1 flex items-center justify-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    <div className="text-center">
                        <h3 className="text-xl font-semibold mb-2">Select a teacher to start chatting</h3>
                        <p>Communicate with your teachers instantly.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
