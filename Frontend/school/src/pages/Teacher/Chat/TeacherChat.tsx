import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../components/layout/ThemeContext';
import { useSocket } from '../../../hooks/useSocket';
import { getConversations, type Conversation, type ChatUser } from '../../../services/ChatService';
import TeacherChatSidebar from './TeacherChatSidebar';
import TeacherChatWindow from './TeacherChatWindow';
import { Loader2 } from 'lucide-react';
import CreateGroupModal from './CreateGroupModal';

import { jwtDecode } from 'jwt-decode';

export const TeacherChat: React.FC = () => {
    const { isDark } = useTheme();
    const socket = useSocket();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string>('');
    useEffect(() => {
        const token = localStorage.getItem('teacherAccessToken') || localStorage.getItem('accessToken');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                setCurrentUserId(String(decoded.id || decoded.userId || decoded._id || ''));
            } catch (error) {
                console.error("Invalid token", error);
            }
        }
    }, []);

    useEffect(() => {
        loadConversations();
    }, [currentUserId]);

    const loadConversations = async () => {
        if (!currentUserId) return;
        try {
            setLoading(true);
            const data = await getConversations();

            // Strengthened Deduplication: Use a consistent key for private chats and group IDs
            const uniqueMap = new Map<string, Conversation>();
            data.forEach(c => {
                let key;
                if (c.isGroup) {
                    key = `group-${c._id}`;
                } else {
                    const other = c.participants.find((p: any) => {
                        const pId = p.participantId._id || p.participantId;
                        return String(pId) !== String(currentUserId);
                    });
                    const otherId = other ? String((other.participantId._id || other.participantId)) : c._id;
                    key = `private-${otherId}`;
                }

                // If duplicate found, keep the one with the latest updatedAt
                if (!uniqueMap.has(key) || new Date(c.updatedAt) > new Date(uniqueMap.get(key)!.updatedAt)) {
                    uniqueMap.set(key, c);
                }
            });

            setConversations(Array.from(uniqueMap.values()).sort((a, b) => {
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            }));
        } catch (error) {
            console.error("Error loading conversations", error);
        } finally {
            setLoading(false);
        }
    };

    // Clear unread count when selection changes
    useEffect(() => {
        if (selectedUser?._id) {
            setConversations(prev => prev.map(c => {
                const other = c.participants.find((p: any) => {
                    const pId = p.participantId._id || p.participantId;
                    return String(pId) !== String(currentUserId);
                });
                const otherId = other ? String((other.participantId._id || other.participantId)) : c._id;

                if ((c.isGroup && String(c._id) === String(selectedUser._id)) || (!c.isGroup && String(otherId) === String(selectedUser._id))) {
                    return { ...c, unreadCount: 0 };
                }
                return c;
            }));
        }
    }, [selectedUser?._id, currentUserId]);

    useEffect(() => {
        if (socket && currentUserId) {
            console.log("📡 Emitting join_chat for:", currentUserId);
            socket.emit('join_chat', currentUserId);
        }
    }, [socket, currentUserId]);

    useEffect(() => {
        if (!socket || !currentUserId) return;

        const handleReceiveMessage = (newMessage: any) => {
            console.log("📩 TeacherChat received socket message:", newMessage);
            setConversations(prev => {
                const isGroupMsg = newMessage.receiverModel === 'Conversation';
                const msgSenderId = String(newMessage.senderId?._id || newMessage.senderId);
                const msgReceiverId = String(newMessage.receiverId?._id || newMessage.receiverId);

                const otherUserId = msgSenderId === currentUserId ? msgReceiverId : msgSenderId;

                let existingConvIndex = -1;

                if (isGroupMsg) {
                    existingConvIndex = prev.findIndex(c => String(c._id) === String(newMessage.receiverId));
                } else {
                    existingConvIndex = prev.findIndex(c =>
                        !c.isGroup &&
                        c.participants.some(p => {
                            const pId = (p.participantId as any)._id || p.participantId;
                            return String(pId) === String(otherUserId);
                        })
                    );
                }

                if (existingConvIndex !== -1) {
                    const updatedConversations = [...prev];
                    const conversation = updatedConversations[existingConvIndex];

                    // Update unreadCount if not currently selected and message is NOT from me
                    const isCurrentlySelected = selectedUser && (
                        (isGroupMsg && String(selectedUser._id) === String(newMessage.receiverId)) ||
                        (!isGroupMsg && String(selectedUser._id) === String(otherUserId))
                    );

                    const newUnreadCount = (!isCurrentlySelected && msgSenderId !== currentUserId)
                        ? (conversation.unreadCount || 0) + 1
                        : (conversation.unreadCount || 0);

                    updatedConversations[existingConvIndex] = {
                        ...conversation,
                        lastMessage: newMessage,
                        updatedAt: new Date().toISOString(),
                        unreadCount: newUnreadCount
                    };

                    const movedConv = updatedConversations.splice(existingConvIndex, 1)[0];
                    updatedConversations.unshift(movedConv);
                    return updatedConversations;
                } else {
                    // Refresh if conversation doesn't exist yet
                    loadConversations();
                    return prev;
                }
            });
        };

        socket.on('receive_message', handleReceiveMessage);
        socket.on('receive_private_message', handleReceiveMessage);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
            socket.off('receive_private_message', handleReceiveMessage);
        };
    }, [socket, currentUserId]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className={`flex h-[calc(100vh-64px)] overflow-hidden ${isDark ? 'bg-[#0f151a]' : 'bg-white'}`}>
            {/* Sidebar - Hidden on mobile if a user is selected */}
            <div className={`${selectedUser ? 'hidden md:flex' : 'flex w-full md:w-72'} h-full`}>
                <TeacherChatSidebar
                    conversations={conversations}
                    selectedUser={selectedUser}
                    onSelectUser={setSelectedUser}
                    isDark={isDark}
                    currentUserId={currentUserId}
                    onCreateGroup={() => setShowCreateGroupModal(true)}
                />
            </div>

            {/* Chat Window - Full screen on mobile if a user is selected, hidden otherwise */}
            <div className={`${selectedUser ? 'flex' : 'hidden md:flex'} flex-1 h-full`}>
                {selectedUser ? (
                    <TeacherChatWindow
                        user={selectedUser}
                        isDark={isDark}
                        socket={socket}
                        startNew={false}
                        onBack={() => setSelectedUser(null)}
                    />
                ) : (
                    <div className={`flex-1 flex items-center justify-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        <div className="text-center p-6">
                            <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <Loader2 className="h-10 w-10 opacity-20" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Select a student to chat</h3>
                            <p className="max-w-xs mx-auto">Choose a conversation from the sidebar to start messaging</p>
                        </div>
                    </div>
                )}
            </div>

            <CreateGroupModal
                isOpen={showCreateGroupModal}
                onClose={() => setShowCreateGroupModal(false)}
                onSuccess={() => {
                    loadConversations();
                }}
                isDark={isDark}
            />
        </div>
    );
};

export default TeacherChat;
