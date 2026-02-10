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

            // Deduplicate conversations (hide existing DB duplicates)
            const uniqueMap = new Map();
            data.forEach(c => {
                let key;
                if (c.isGroup) {
                    key = c._id;
                } else {
                    // For private chat, key is the Other User ID
                    const other = c.participants.find((p: any) => {
                        const pId = p.participantId._id || p.participantId;
                        return String(pId) !== String(currentUserId);
                    });
                    key = other ? String((other.participantId._id || other.participantId)) : c._id;
                }

                if (!uniqueMap.has(key)) {
                    uniqueMap.set(key, c);
                }
            });

            setConversations(Array.from(uniqueMap.values()).sort((a: any, b: any) => {
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            }));
        } catch (error) {
            console.error("Error loading conversations", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (socket && currentUserId) {
            socket.emit('join_chat', currentUserId);
        }
    }, [socket, currentUserId]);

    useEffect(() => {
        if (!socket || !currentUserId) return;

        const handleReceiveMessage = (newMessage: any) => {
            setConversations(prev => {
                const isGroupMsg = newMessage.receiverModel === 'Conversation';
                const msgSenderId = typeof newMessage.senderId === 'object' ? newMessage.senderId._id : newMessage.senderId;
                const msgReceiverId = typeof newMessage.receiverId === 'object' ? newMessage.receiverId._id : newMessage.receiverId;

                const otherUserId = String(msgSenderId) === String(currentUserId) ? String(msgReceiverId) : String(msgSenderId);

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
                    updatedConversations[existingConvIndex] = {
                        ...conversation,
                        lastMessage: newMessage,
                        updatedAt: new Date().toISOString()
                    };

                    const movedConv = updatedConversations.splice(existingConvIndex, 1)[0];
                    updatedConversations.unshift(movedConv);
                    return updatedConversations;
                } else {
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
            <div className={`${selectedUser ? 'hidden md:flex' : 'flex w-full md:w-80'} h-full`}>
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
