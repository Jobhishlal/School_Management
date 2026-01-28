import { useState } from 'react';
import { type ChatUser, type Conversation } from '../../../services/ChatService';
import { Search, MessageSquarePlus } from 'lucide-react';
import TeacherListModal from './TeacherListModal';

interface ChatSidebarProps {
    conversations: Conversation[];
    selectedUser: ChatUser | null;
    onSelectUser: (user: ChatUser) => void;
    isDark: boolean;
    onlineUsers: Set<string>;
    currentUserId: string;
}

export default function ChatSidebar({ conversations, selectedUser, onSelectUser, isDark, onlineUsers, currentUserId }: ChatSidebarProps) {
    const [showTeacherListModal, setShowTeacherListModal] = useState(false);

    return (
        <div className={`w-80 border-r flex flex-col ${isDark ? 'border-slate-700 bg-slate-800/30' : 'border-slate-200 bg-slate-50/50'}`}>
            <div className="p-4 border-b border-transparent">
                <div className="flex items-center justify-between mb-4">
                    <h2 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Messages</h2>
                    <button
                        onClick={() => setShowTeacherListModal(true)}
                        className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                        title="New Message"
                    >
                        <MessageSquarePlus size={20} />
                    </button>
                </div>
                <div className={`relative flex items-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <Search size={18} className="absolute left-3" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none transition-all ${isDark
                            ? 'bg-slate-700/50 focus:bg-slate-700 text-slate-200 placeholder-slate-500'
                            : 'bg-white border border-slate-200 focus:border-blue-400 text-slate-700'
                            }`}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                        No conversations found.
                    </div>
                ) : (
                    conversations.map(conv => {
                        let otherUser: ChatUser | undefined;
                        if (conv.isGroup) {
                            otherUser = {
                                _id: conv._id,
                                name: conv.groupName || 'Group Chat',
                                email: '',
                                profileImage: '',
                                role: 'group',
                                isGroup: true,
                                participants: conv.participants
                            };
                        } else {
                            const participant = conv.participants.find(p => p.participantId && String((p.participantId as any)._id || p.participantId) !== String(currentUserId));
                            otherUser = participant?.participantId;
                        }

                        if (!otherUser) return null;

                        return (
                            <div
                                key={conv._id}
                                onClick={() => onSelectUser(otherUser!)}
                                className={`p-3 mx-2 my-1 rounded-xl cursor-pointer transition-colors flex items-center gap-3 ${selectedUser?._id === otherUser!._id
                                    ? (isDark ? 'bg-blue-600/20 text-blue-100' : 'bg-blue-50 text-blue-700')
                                    : (isDark ? 'text-slate-300 hover:bg-slate-700/50' : 'text-slate-600 hover:bg-slate-100')
                                    }`}
                            >
                                <div className="relative">
                                    <img
                                        src={otherUser!.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser!.name || (otherUser as any).fullName)}&background=random`}
                                        alt={otherUser!.name || (otherUser as any).fullName}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    {!conv.isGroup && (
                                        <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white dark:border-slate-800 rounded-full ${onlineUsers.has(otherUser!._id) ? 'bg-green-500' : 'bg-gray-400'
                                            }`}></span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm truncate">{otherUser!.name || (otherUser as any).fullName}</h4>
                                    <p className={`text-xs truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {conv.lastMessage?.content || 'Click to chat'}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <TeacherListModal
                isOpen={showTeacherListModal}
                onClose={() => setShowTeacherListModal(false)}
                onSelectTeacher={onSelectUser}
                isDark={isDark}
                existingChatUserIds={new Set(conversations.map(c => {
                    if (c.isGroup) return null;
                    const p = c.participants.find(p => p.participantId && String((p.participantId as any)._id || p.participantId) !== String(currentUserId));
                    return p?.participantId ? String((p.participantId as any)._id || p.participantId) : null;
                }).filter(Boolean) as string[])}
            />
        </div>
    );
}
