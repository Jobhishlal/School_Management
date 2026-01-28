import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../components/layout/ThemeContext';
import { useSocket } from '../../../hooks/useSocket';
import { getConversations, type Conversation, type ChatUser } from '../../../services/ChatService';
import TeacherChatSidebar from './TeacherChatSidebar';
import TeacherChatWindow from './TeacherChatWindow';
import { Loader2 } from 'lucide-react';
import CreateGroupModal from './CreateGroupModal';

export const TeacherChat: React.FC = () => {
    const { isDark } = useTheme();
    const socket = useSocket();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem('teacher') || '{}');

    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
        try {
            setLoading(true);
            const data = await getConversations();
            setConversations(data);
        } catch (error) {
            console.error("Error loading conversations", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (newMessage: any) => {
            setConversations(prev => {
                // Logic to identify which conversation to update.
                // For group chat: receiverId is the Group ID.
                // For private chat: senderId is the Other User ID (if I am receiver).
                // Or if I am sender (e.g. multi-device), receiverId is Other User.

                const isGroupMsg = newMessage.receiverModel === 'Conversation';
                const targetConvId = isGroupMsg ? newMessage.receiverId : (
                    newMessage.senderId === currentUser.id ? newMessage.receiverId : newMessage.senderId
                );

                const existingConvIndex = prev.findIndex(c => c._id === targetConvId);

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
                    // New conversation found, reload strictly or optimistic add if we had a way to get user details
                    loadConversations();
                    return prev;
                }
            });
        };

        socket.on('receive_message', handleReceiveMessage);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [socket]);

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
                currentUserId={currentUser.id}
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
