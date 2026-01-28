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
        const token = localStorage.getItem('teacherAccessToken');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                setCurrentUserId(decoded.id || decoded.userId || decoded._id || '');
            } catch (error) {
                console.error("Invalid token", error);
            }
        }
    }, []);

    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
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
                    key = other ? (other.participantId._id || other.participantId) : c._id;
                }

                // Keep the one with the latest message or update (assuming data is sorted by latest first)
                if (!uniqueMap.has(key)) {
                    uniqueMap.set(key, c);
                }
            });

            setConversations(Array.from(uniqueMap.values()));
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
        if (!socket) return;

        const handleReceiveMessage = (newMessage: any) => {
            setConversations(prev => {
                // Logic to identify which conversation to update.
                // For group chat: receiverId is the Group ID.
                // For private chat: senderId is the Other User ID (if I am receiver).
                // Or if I am sender (e.g. multi-device), receiverId is Other User.

                const isGroupMsg = newMessage.receiverModel === 'Conversation';
                const otherUserId = newMessage.senderId === currentUserId ? newMessage.receiverId : newMessage.senderId;

                let existingConvIndex = -1;

                if (isGroupMsg) {
                    existingConvIndex = prev.findIndex(c => c._id === newMessage.receiverId);
                } else {
                    // For 1-on-1, Conversation ID != User ID. Must match by Participants.
                    existingConvIndex = prev.findIndex(c =>
                        !c.isGroup &&
                        c.participants.some(p => {
                            const pId = (p.participantId as any)._id || p.participantId;
                            return String(pId) === String(otherUserId);
                        })
                    );
                }

                if (existingConvIndex !== -1) {
                    // ... same logic ...
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
                    // New conversation found, reload strictly
                    loadConversations();
                    return prev;
                }
            });
        };

        socket.on('receive_message', handleReceiveMessage);
        // Also listen for private messages to ensure self-updates (sent message) works
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
            <TeacherChatSidebar
                conversations={conversations}
                selectedUser={selectedUser}
                onSelectUser={setSelectedUser}
                isDark={isDark}
                currentUserId={currentUserId}
                onCreateGroup={() => setShowCreateGroupModal(true)}
            />
            {selectedUser ? (
                <TeacherChatWindow
                    user={selectedUser}
                    isDark={isDark}
                    socket={socket}
                    startNew={false}
                />
            ) : (
                <div className={`flex-1 flex items-center justify-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    <div className="text-center">
                        <h3 className="text-xl font-semibold mb-2">Select a student to chat</h3>
                        <p>Choose a conversation from the sidebar</p>
                    </div>
                </div>
            )}

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
