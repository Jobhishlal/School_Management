import { useState, useEffect, useRef } from 'react';
import { getChatHistory, markMessagesRead, type ChatUser, type ChatMessage } from '../../../services/ChatService';
import { Send, Paperclip, MoreVertical, Check, CheckCheck, Trash2 } from 'lucide-react';
import { Socket } from 'socket.io-client';
import api from '../../../services/api';
import { jwtDecode } from 'jwt-decode';


interface TeacherChatWindowProps {
    user: ChatUser;
    isDark: boolean;
    socket: Socket | null;
    startNew?: boolean;
}

export default function TeacherChatWindow({ user, isDark, socket }: TeacherChatWindowProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [currentUserId, setCurrentUserId] = useState<string>('');

    // Edit state
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('teacherAccessToken') || localStorage.getItem('accessToken');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                setCurrentUserId(decoded.id || decoded.userId || decoded._id);
            } catch (e) {
                console.error("Token decode failed", e);
            }
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const loadHistory = async () => {
            if (!user._id) return;
            try {
                const history = await getChatHistory(user._id);
                setMessages(history);
                scrollToBottom();
                markMessagesRead(user._id);
            } catch (error) {
                console.error("Failed to load history", error);
            }
        };
        loadHistory();
    }, [user._id]);

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (message: ChatMessage) => {
            // Robust check for sender (handle object or string)
            const msgSenderId = typeof message.senderId === 'object' ? (message.senderId as any)._id : message.senderId;

            // Prevent duplication: If I sent this message, it's already added by handleSendMessage
            if (String(msgSenderId) === String(currentUserId)) {
                return;
            }

            if (message.senderId === user._id || message.receiverId === user._id || (user.isGroup && message.receiverId === user._id)) {
                setMessages(prev => {
                    if (prev.some(m => m._id === message._id)) return prev;
                    return [...prev, message];
                });
                scrollToBottom();
            }
        };

        const handleMessagesRead = (data: { readerId: string }) => {
            if (data.readerId === user._id) {
                setMessages(prev => prev.map(msg =>
                    (msg.senderId === currentUserId && !msg.read)
                        ? { ...msg, read: true }
                        : msg
                ));
            }
        };

        const handleMessageUpdated = (updatedMessage: ChatMessage) => {
            setMessages(prev => prev.map(msg =>
                msg._id === updatedMessage._id ? updatedMessage : msg
            ));
        };

        const handleMessageDeleted = (data: { messageId: string, isDeleted: boolean }) => {
            setMessages(prev => prev.map(msg =>
                msg._id === data.messageId ? { ...msg, isDeleted: true, content: 'This message was deleted' } : msg
            ));
        };

        socket.on('receive_message', handleReceiveMessage);
        socket.on('messages_read', handleMessagesRead);
        socket.on('message_updated', handleMessageUpdated);
        socket.on('message_deleted', handleMessageDeleted);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
            socket.off('messages_read', handleMessagesRead);
            socket.off('message_updated', handleMessageUpdated);
            socket.off('message_deleted', handleMessageDeleted);
        };
    }, [socket, user._id, currentUserId]);

    // Edit Handlers
    const handleEditClick = (msg: ChatMessage) => {
        setEditingMessageId(msg._id);
        setNewMessage(msg.content);
        // Focus input
        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (input) input.focus();
    };

    const handleDeleteClick = async (msgId: string) => {
        try {
            await api.put('/chat/delete', { messageId: msgId });
        } catch (error: any) {
            console.error("Failed to delete message", error);
            alert("Failed to delete");
        }
    };

    const handleCancelEdit = () => {
        setEditingMessageId(null);
        setNewMessage('');
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        if (editingMessageId) {
            // Handle Edit
            try {
                await api.put('/chat/edit', { messageId: editingMessageId, content: newMessage });
                setEditingMessageId(null);
                setNewMessage('');
            } catch (error: any) {
                console.error("Failed to edit message", error);
                alert(error.response?.data?.message || "Failed to edit");
            }
            return;
        }

        try {
            const payload = {
                receiverId: user._id,
                receiverRole: user.isGroup ? 'Conversation' : 'student',
                content: newMessage,
                type: 'text'
            };

            const response = await api.post('/chat/send', payload);
            const message = response.data.data;

            setMessages(prev => [...prev, message]);
            setNewMessage('');
            scrollToBottom();
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploading(true);
            const response = await api.post('/chat/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const { url, type } = response.data.data;

            const payload = {
                receiverId: user._id,
                receiverRole: user.isGroup ? 'Conversation' : 'student',
                content: url,
                type: type
            };

            const sendResponse = await api.post('/chat/send', payload);
            const message = sendResponse.data.data;

            setMessages(prev => [...prev, message]);
            scrollToBottom();
        } catch (error) {
            console.error("File upload failed", error);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const renderMessageContent = (msg: ChatMessage) => {
        if ((msg as any).isDeleted) {
            return <p className="text-sm italic opacity-50 text-slate-500">This message was deleted</p>;
        }
        if (msg.type === 'image') {
            return (
                <div className="cursor-pointer" onClick={() => window.open(msg.content, '_blank')}>
                    <img
                        src={msg.content}
                        alt="Shared image"
                        className="max-w-[200px] rounded-lg border border-slate-200 dark:border-slate-600"
                        loading="lazy"
                    />
                </div>
            );
        }
        if (msg.type === 'file') {
            return (
                <a href={msg.content} target="_blank" rel="noreferrer" className="flex items-center gap-2 underline text-blue-500">
                    <Paperclip size={16} />
                    <span>Attachment</span>
                </a>
            );
        }
        return (
            <div className="group relative">
                <p className="text-sm break-words">{msg.content}</p>
                {(msg as any).isEdited && <span className="text-[10px] opacity-60 italic ml-1">(edited)</span>}
            </div>
        );
    };

    return (
        <div className="flex-1 flex flex-col h-full">
            {/* Header */}
            <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-center gap-3">
                    <img
                        src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || (user as any).fullName)}&background=random`}
                        alt={user.name || (user as any).fullName}
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.name || (user as any).fullName}</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Online</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDark ? 'bg-[#0f151a]' : 'bg-slate-50'}`}>
                {messages.map((msg, idx) => {
                    const senderIdStr = typeof msg.senderId === 'object' ? (msg.senderId as any)._id : msg.senderId;
                    const isMe = String(senderIdStr) === String(currentUserId);

                    const getSenderDetails = (senderId: string) => {
                        if (!user.isGroup || !user.participants) return null;
                        const p = user.participants.find(p => {
                            const pId = (p.participantId as any)._id || p.participantId;
                            return String(pId) === String(senderId);
                        });
                        return p?.participantId;
                    };

                    const senderDetails = !isMe && user.isGroup ? getSenderDetails(senderIdStr) : null;
                    const showHeader = !isMe && user.isGroup && senderDetails;

                    // Editable check
                    const isEditable = isMe && msg.type === 'text' && (Date.now() - new Date(msg.timestamp).getTime() < 5 * 60 * 1000);

                    return (
                        <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group/msg`}>
                            {showHeader && (
                                <span className={`text-xs mb-1 ml-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {senderDetails?.name || (senderDetails as any)?.fullName || 'User'}
                                </span>
                            )}
                            <div className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'} max-w-[80%]`}>
                                {showHeader && (
                                    <img
                                        src={senderDetails?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(senderDetails?.name || (senderDetails as any)?.fullName || 'User')}&background=random`}
                                        alt={senderDetails?.name || (senderDetails as any)?.fullName}
                                        className="w-6 h-6 rounded-full mt-1"
                                    />
                                )}
                                <div className={`relative rounded-2xl p-3 shadow-sm ${isMe
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : (isDark ? 'bg-slate-700 text-slate-200 rounded-bl-none' : 'bg-white text-slate-800 rounded-bl-none border border-slate-100')
                                    }`}>
                                    {renderMessageContent(msg)}
                                    <span className={`text-[10px] mt-1 block text-right opacity-70`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {isMe && (
                                            <span className="inline-block ml-1">
                                                {msg.read ? <CheckCheck size={14} className="inline text-blue-200" /> : <Check size={14} className="inline text-slate-300" />}
                                            </span>
                                        )}
                                    </span>
                                    {isEditable && editingMessageId !== msg._id && !(msg as any).isDeleted && (
                                        <div className="absolute -top-2 -left-8 flex gap-1 bg-white dark:bg-slate-800 rounded-full shadow-sm opacity-0 group-hover/msg:opacity-100 transition p-1 z-10 w-auto">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleEditClick(msg); }}
                                                className="text-slate-500 hover:text-blue-500 p-1"
                                                title="Edit"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteClick(msg._id); }}
                                                className="text-slate-500 hover:text-red-500 p-1"
                                                title="Delete"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Editing Banner */}
            {editingMessageId && (
                <div className={`px-4 py-2 text-sm flex justify-between items-center ${isDark ? 'bg-slate-800 text-slate-300 border-t border-slate-700' : 'bg-slate-100 text-slate-600 border-t border-slate-200'}`}>
                    <span>Editing message...</span>
                    <button onClick={handleCancelEdit} className="text-blue-500 hover:underline">Cancel</button>
                </div>
            )}

            {/* Input */}
            <div className={`p-4 border-t ${isDark ? 'border-slate-700 bg-slate-800/30' : 'border-slate-200 bg-white'}`}>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                    accept="image/*,video/*,.pdf,.doc,.docx"
                />
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className={`p-3 rounded-xl transition ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                    >
                        {uploading ? <div className="animate-spin w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full" /> : <Paperclip size={20} />}
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={editingMessageId ? "Edit your message..." : "Type your message..."}
                        className={`flex-1 p-3 rounded-xl outline-none ${isDark
                            ? 'bg-slate-700/50 text-white placeholder-slate-500 focus:bg-slate-700'
                            : 'bg-slate-100 text-slate-900 placeholder-slate-500 focus:bg-white border focus:border-blue-400'
                            }`}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className={`p-3 rounded-xl transition flex items-center justify-center ${newMessage.trim()
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30'
                            : (isDark ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-200 text-slate-400 cursor-not-allowed')
                            }`}
                    >
                        {editingMessageId ? <Check size={20} /> : <Send size={20} />}
                    </button>
                </form>
            </div>
        </div>
    );
}
