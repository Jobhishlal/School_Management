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

        const socketUrl = import.meta.env.VITE_SERVER_URL?.startsWith('/')
            ? window.location.origin
            : (import.meta.env.VITE_SERVER_URL || 'https://brainnots.ddns.net');

        console.log("ChatLayout: Initializing socket with URL:", socketUrl);

        const newSocket = io(socketUrl, {
            withCredentials: true,
            transports: ['websocket'],
            path: '/socket.io'
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
        <div className={`flex h-[calc(100vh-2rem)] md:h-[calc(100vh-2rem)] rounded-xl md:rounded-2xl overflow-hidden border ${isDark ? 'bg-[#121A21] border-slate-700' : 'bg-white border-slate-200'} shadow-xl relative`}>
            {/* Sidebar: hidden on mobile if a user is selected */}
            <div className={`w-full md:w-80 h-full ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
                <ChatSidebar
                    conversations={conversations}
                    selectedUser={selectedUser}
                    onSelectUser={setSelectedUser}
                    isDark={isDark}
                    onlineUsers={onlineUsers}
                    currentUserId={currentUserId}
                />
            </div>

            {/* Chat Window: hidden on mobile if no user is selected */}
            {selectedUser ? (
                <div className="flex-1 min-w-0 h-full flex flex-col">
                    <ChatWindow
                        teacher={selectedUser}
                        isDark={isDark}
                        socket={socket}
                        onBack={() => setSelectedUser(null)}
                    />
                </div>
            ) : (
                <div className={`hidden md:flex flex-1 items-center justify-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    <div className="text-center p-6">
                        <div className={`w-16 h-16 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-slate-50'} flex items-center justify-center mx-auto mb-4 border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                            <ChatUserIcon size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Select a Teacher</h3>
                        <p className="text-sm max-w-[240px]">Start an instant conversation with your teachers or group members.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// Simple internal icon component for the placeholder
const ChatUserIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);
