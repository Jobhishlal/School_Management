import { useState, useEffect } from 'react';
import { type Conversation, type ChatUser, searchUsers } from '../../../services/ChatService';
import { Search, MessageSquarePlus, Users, Hash } from 'lucide-react';
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
                participants: conv.participants as any
            };
        }

        const participant = conv.participants.find(p => {
            const pId = (p.participantId as any)._id || p.participantId;
            return p.participantId && String(pId) !== String(currentUserId);
        });

        if (!participant) return undefined;

        const pId = participant.participantId;
        if (typeof pId === 'string') {
            return {
                _id: pId,
                name: 'Unknown User',
                email: '',
                profileImage: '',
                role: 'student'
            };
        }

        return pId as ChatUser;
    };

    const renderConversationItem = (conv: Conversation, index: number) => {
        const otherUser = getOtherParticipant(conv);
        if (!otherUser) return null;

        const isSelected = selectedUser?._id === otherUser._id;
        const lastMsg = conv.lastMessage;
        const time = conv.updatedAt ? new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

        return (
            <div
                key={conv._id || index}
                onClick={() => { onSelectUser(otherUser); setSearchQuery(''); }}
                className={`group relative mx-2 my-0.5 p-2.5 rounded-xl cursor-pointer transition-all duration-300 ease-out flex items-center gap-2.5 overflow-hidden ${isSelected
                    ? (isDark ? 'bg-blue-600/15 ring-1 ring-blue-500/20' : 'bg-blue-50/80 ring-1 ring-blue-200/50')
                    : (isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-100/80')
                    }`}
            >
                {/* Active Indicator Bar */}
                {isSelected && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
                )}

                <div className="relative flex-shrink-0">
                    {conv.isGroup ? (
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm ${isDark ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-50 text-emerald-600'}`}>
                            <Users size={20} />
                        </div>
                    ) : (
                        <div className="relative">
                            <img
                                src={otherUser.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.name || (otherUser as any).fullName)}&background=random&bold=true`}
                                alt={otherUser.name || (otherUser as any).fullName}
                                className="w-10 h-10 rounded-xl object-cover transition-transform group-hover:scale-105 border border-slate-200/10 shadow-sm"
                            />
                            {otherUser.isOnline && (
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full" />
                            )}
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                        <h4 className={`font-bold text-[15px] truncate max-w-[140px] ${isSelected
                            ? (isDark ? 'text-blue-200' : 'text-blue-900')
                            : (isDark ? 'text-slate-200' : 'text-slate-800')
                            }`}>
                            {otherUser.name || (otherUser as any).fullName}
                        </h4>
                        <span className={`text-[10px] whitespace-nowrap pt-0.5 ${isSelected
                            ? (isDark ? 'text-blue-400/80' : 'text-blue-500/80')
                            : (isDark ? 'text-slate-500' : 'text-slate-400')
                            }`}>
                            {time}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <p className={`text-xs truncate ${isSelected
                            ? (isDark ? 'text-blue-300/70' : 'text-blue-600/70')
                            : (isDark ? 'text-slate-500' : 'text-slate-400')
                            }`}>
                            {lastMsg?.type === 'audio' ? '🎤 Voice message'
                                : lastMsg?.type === 'image' ? '📷 Photo'
                                    : lastMsg?.type === 'file' ? '📎 Attachment'
                                        : lastMsg?.content || 'Tap to chat'}
                        </p>
                    </div>
                </div>

                {/* Unread Count Badge */}
                {conv.unreadCount !== undefined && conv.unreadCount > 0 && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex-shrink-0 bg-blue-600 text-white text-[10px] font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40 animate-in zoom-in-50 duration-300">
                        {conv.unreadCount}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={`w-full flex flex-col h-full overflow-hidden ${isDark ? 'bg-[#0f151a] border-slate-800' : 'bg-[#f8fafc] border-slate-200'} border-r`}>
            {/* Sidebar Header */}
            <div className={`p-4 pb-3 ${isDark ? 'bg-[#0f151a]/80' : 'bg-white/80'} backdrop-blur-xl z-10 space-y-3`}>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className={`font-black text-lg tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Messages</h2>
                        <p className={`text-[9px] font-bold uppercase tracking-widest opacity-40 mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Real-time Sync</p>
                    </div>
                    <div className="flex gap-1.5">
                        <button
                            onClick={() => setShowNewChatModal(true)}
                            className="w-9 h-9 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-600/20 flex items-center justify-center group"
                            title="New Message"
                        >
                            <MessageSquarePlus size={18} className="group-hover:rotate-6 transition-transform" />
                        </button>
                        <button
                            onClick={onCreateGroup}
                            className={`w-9 h-9 rounded-xl transition-all active:scale-95 shadow-sm flex items-center justify-center group ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
                            title="Create Group"
                        >
                            <Users size={18} className="group-hover:rotate-6 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative group">
                    <Search size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-slate-600 group-focus-within:text-blue-500' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm font-medium outline-none transition-all ${isDark
                            ? 'bg-slate-800/40 focus:bg-slate-800 text-white placeholder-slate-600 border border-transparent focus:border-blue-500/20'
                            : 'bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 border border-transparent focus:border-blue-400/20 focus:shadow-sm'
                            }`}
                    />
                </div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pt-1">
                {searchQuery ? (
                    <div className="space-y-6">
                        {/* Search Sections */}
                        {conversations.some(c => {
                            const other = getOtherParticipant(c);
                            return (other?.name || (other as any)?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase());
                        }) && (
                                <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                                    <p className={`px-6 mb-2 text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Active Conversations</p>
                                    {conversations
                                        .filter(c => {
                                            const other = getOtherParticipant(c);
                                            return (other?.name || (other as any)?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase());
                                        })
                                        .map((conv, i) => renderConversationItem(conv, i))}
                                </div>
                            )}

                        {searchResults.length > 0 && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-500 pb-6">
                                <p className={`px-6 mb-2 text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Discovery</p>
                                {searchResults.map(user => (
                                    <div
                                        key={user._id}
                                        onClick={() => { onSelectUser(user); setSearchQuery(''); }}
                                        className={`group mx-3 my-1 p-3 rounded-2xl cursor-pointer transition-all flex items-center gap-3 ${isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-100/80 border border-transparent hover:border-slate-200/50'}`}
                                    >
                                        <div className="relative">
                                            <img
                                                src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&bold=true`}
                                                alt={user.name}
                                                className="w-12 h-12 rounded-2xl object-cover border border-slate-200/10 shadow-sm"
                                            />
                                            {user.isOnline && (
                                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-slate-900 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className={`font-bold text-[15px] ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{user.name}</h4>
                                            <p className="text-[11px] text-slate-500 truncate">{user.email || 'Student'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!searchResults.length && !conversations.some(c => (getOtherParticipant(c)?.name || '').toLowerCase().includes(searchQuery.toLowerCase())) && (
                            <div className="text-center py-12 px-6">
                                <div className={`w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center ${isDark ? 'bg-slate-800/50 text-slate-700' : 'bg-slate-50 text-slate-300'}`}>
                                    <Search size={32} />
                                </div>
                                <h5 className={`font-bold mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>No matches found</h5>
                                <p className="text-xs text-slate-500 font-medium">Try searching for a different name.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="animate-in fade-in duration-500">
                        {conversations.length > 0 ? (
                            conversations.map((conv, i) => renderConversationItem(conv, i))
                        ) : (
                            <div className="text-center py-20 px-10">
                                <div className={`w-20 h-20 rounded-[2.5rem] mx-auto mb-6 flex items-center justify-center shadow-xl ${isDark ? 'bg-slate-800 text-slate-700 shadow-black/20' : 'bg-slate-50 text-slate-200 shadow-slate-200'}`}>
                                    <Hash size={40} />
                                </div>
                                <h4 className={`text-lg font-bold mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Start a conversation</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">Your message history will appear here once you start chatting with students.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <NewChatModal
                isOpen={showNewChatModal}
                onClose={() => setShowNewChatModal(false)}
                onSelectStudent={onSelectUser}
                isDark={isDark}
                existingChatUserIds={new Set(conversations.map(c => {
                    if (c.isGroup) return null;
                    const p = c.participants.find(p => {
                        const pId = (p.participantId as any)._id || p.participantId;
                        return p.participantId && String(pId) !== String(currentUserId);
                    });
                    const pIdValue = p?.participantId ? ((p.participantId as any)._id || p.participantId) : null;
                    return pIdValue ? String(pIdValue) : null;
                }).filter(Boolean) as string[])}
            />
        </div>
    );
}

