import { useState, useEffect } from 'react';
import { type Conversation, type ChatUser, searchUsers } from '../../../services/ChatService';
import { Search, MessageSquarePlus } from 'lucide-react';
import NewChatModal from './NewChatModal';

interface TeacherChatSidebarProps {
    conversations: Conversation[];
    selectedUser: ChatUser | null;
    onSelectUser: (user: ChatUser) => void;
    isDark: boolean;
    currentUserId: string;
    onCreateGroup: () => void;
}

export default function TeacherChatSidebar({ conversations, selectedUser, onSelectUser, isDark, currentUserId, onCreateGroup }: TeacherChatSidebarProps) {
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<ChatUser[]>([]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.trim()) {
                const results = await searchUsers(searchQuery, 'student');
                setSearchResults(results);
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const getOtherParticipant = (conv: Conversation): ChatUser | undefined => {
        if (conv.isGroup) {
            return {
                _id: conv._id,
                name: conv.groupName || 'Group Chat',
                email: '',
                profileImage: '',
                role: 'group',
                isGroup: true,
                participants: conv.participants
            };
        }
        console.log("teacher data", getOtherParticipant)
        const participant = conv.participants.find(p => p.participantId && String((p.participantId as any)._id || p.participantId) !== String(currentUserId));
        return participant?.participantId;
    };

    return (
        <div className={`w-80 border-r flex flex-col ${isDark ? 'border-slate-700 bg-slate-800/30' : 'border-slate-200 bg-slate-50/50'}`}>
            <div className="p-4 border-b border-transparent">
                <div className="flex items-center justify-between mb-4">
                    <h2 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Messages</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowNewChatModal(true)}
                            className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                            title="New Message"
                        >
                            <MessageSquarePlus size={20} />
                        </button>
                        <button
                            onClick={onCreateGroup}
                            className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition" // Changed color to distinguish
                            title="Create Class Group"
                        >
                            <span className="text-xl leading-none">+</span>
                        </button>
                    </div>
                </div>
                <div className={`relative flex items-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <Search size={18} className="absolute left-3" />
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none transition-all ${isDark
                            ? 'bg-slate-700/50 focus:bg-slate-700 text-slate-200 placeholder-slate-500'
                            : 'bg-white border border-slate-200 focus:border-blue-400 text-slate-700'
                            }`}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {searchQuery ? (
                    <div className="p-2">
                        {/* Existing Chats */}
                        {conversations.filter(conv => {
                            const other = getOtherParticipant(conv);
                            const name = other?.name || (other as any)?.fullName || '';
                            return name.toLowerCase().includes(searchQuery.toLowerCase());
                        }).length > 0 && (
                                <div className="mb-4">
                                    <p className={`text-xs px-2 mb-2 font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Existing Chats</p>
                                    {conversations
                                        .filter(conv => {
                                            const other = getOtherParticipant(conv);
                                            const name = other?.name || (other as any)?.fullName || '';
                                            return name.toLowerCase().includes(searchQuery.toLowerCase());
                                        })
                                        .map((conv, index) => {
                                            const otherUser = getOtherParticipant(conv);
                                            if (!otherUser) return null;
                                            return (
                                                <div
                                                    key={conv._id || index}
                                                    onClick={() => { onSelectUser(otherUser); setSearchQuery(''); }}
                                                    className={`p-3 mx-2 my-1 rounded-xl cursor-pointer transition-colors flex items-center gap-3 ${selectedUser?._id === otherUser._id
                                                        ? (isDark ? 'bg-blue-600/20 text-blue-100' : 'bg-blue-50 text-blue-700')
                                                        : (isDark ? 'text-slate-300 hover:bg-slate-700/50' : 'text-slate-600 hover:bg-slate-100')
                                                        }`}
                                                >
                                                    <div className="relative">
                                                        <img
                                                            src={otherUser.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.name || (otherUser as any).fullName)}&background=random`}
                                                            alt={otherUser.name || (otherUser as any).fullName}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-sm truncate">{otherUser.name || (otherUser as any).fullName}</h4>
                                                        <p className={`text-xs truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                            {conv.isGroup ? 'Group Chat' : (conv.lastMessage?.content || 'No messages')}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            )}

                        {/* Global Search Results */}
                        {searchResults.length > 0 && (
                            <div>
                                <p className={`text-xs px-2 mb-2 font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Global Search</p>
                                {searchResults.map(user => (
                                    <div
                                        key={user._id}
                                        onClick={() => {
                                            onSelectUser(user);
                                            setSearchQuery('');
                                        }}
                                        className={`p-3 mx-2 my-1 rounded-xl cursor-pointer transition-colors flex items-center gap-3 ${isDark ? 'hover:bg-slate-700/50 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}
                                    >
                                        <div className="relative">
                                            <img
                                                src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                                                alt={user.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm truncate">{user.name}</h4>
                                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {searchResults.length === 0 && conversations.filter(conv => {
                            const other = getOtherParticipant(conv);
                            return other && other.name.toLowerCase().includes(searchQuery.toLowerCase());
                        }).length === 0 && (
                                <p className="text-sm text-center text-slate-500 py-4">No students found</p>
                            )}
                    </div>
                ) : (
                    conversations.map((conv, index) => {
                        const otherUser = getOtherParticipant(conv);
                        if (!otherUser) return null;

                        return (
                            <div
                                key={conv._id || index}
                                onClick={() => onSelectUser(otherUser)}
                                className={`p-3 mx-2 my-1 rounded-xl cursor-pointer transition-colors flex items-center gap-3 ${selectedUser?._id === otherUser._id
                                    ? (isDark ? 'bg-blue-600/20 text-blue-100' : 'bg-blue-50 text-blue-700')
                                    : (isDark ? 'text-slate-300 hover:bg-slate-700/50' : 'text-slate-600 hover:bg-slate-100')
                                    }`}
                            >
                                <div className="relative">
                                    <img
                                        src={otherUser.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.name || (otherUser as any).fullName)}&background=random`}
                                        alt={otherUser.name || (otherUser as any).fullName}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm truncate">{otherUser.name || (otherUser as any).fullName}</h4>
                                    <p className={`text-xs truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {conv.lastMessage?.content || 'No messages yet'}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <NewChatModal
                isOpen={showNewChatModal}
                onClose={() => setShowNewChatModal(false)}
                onSelectStudent={onSelectUser}
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
