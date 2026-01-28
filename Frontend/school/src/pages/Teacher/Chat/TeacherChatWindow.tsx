import { useState, useEffect, useRef } from 'react';
import { getChatHistory, markMessagesRead, type ChatUser, type ChatMessage } from '../../../services/ChatService';
import { Send, Paperclip, Check, CheckCheck } from 'lucide-react';
import { Socket } from 'socket.io-client';
import api from '../../../services/api';
import { jwtDecode } from 'jwt-decode';

interface TeacherChatWindowProps {
    user: ChatUser;
    isDark: boolean;
    socket: Socket | null;
    startNew?: boolean; // If true, we might not have a conversation yet
}

export default function TeacherChatWindow({ user, isDark, socket }: TeacherChatWindowProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [currentUserId, setCurrentUserId] = useState<string>('');


    // Import moved to top
    // Get current teacher ID
    useEffect(() => {
        const token = localStorage.getItem('teacherAccessToken') || localStorage.getItem('accessToken');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                // Adjust based on your token payload structure (usually id or _id or userId)
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
            if (message.senderId === user._id || message.receiverId === user._id) {
                setMessages(prev => [...prev, message]);
                scrollToBottom();
                if (message.senderId === user._id) {
                    markMessagesRead(user._id);
                }
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

        socket.on('receive_message', handleReceiveMessage);
        socket.on('messages_read', handleMessagesRead);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
            socket.off('messages_read', handleMessagesRead);
        };
    }, [socket, user._id, currentUserId]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

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

    // ... (existing helper functions)

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

            // Send message with file URL
            const payload = {
                receiverId: user._id,
                receiverRole: user.isGroup ? 'Conversation' : 'student',
                content: url, // For media, content is the URL
                type: type // 'image' or 'file'
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
        // Fallback for text or file (could add specific file icon logic later)
        if (msg.type === 'file') {
            return (
                <a href={msg.content} target="_blank" rel="noreferrer" className="flex items-center gap-2 underline text-blue-500">
                    <Paperclip size={16} />
                    <span>Attachment</span>
                </a>
            );
        }
        return <p className="text-sm break-words">{msg.content}</p>;
    };

    return (
        <div className="flex-1 flex flex-col h-full">
            {/* Header ... */}
            <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white'}`}>
                {/* ... existing header code ... */}
                <div className="flex items-center gap-3">
                    <img
                        src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.name}</h3>
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
                    // Robust comparison for isMe
                    const senderIdStr = typeof msg.senderId === 'object' ? (msg.senderId as any)._id : msg.senderId;
                    const isMe = String(senderIdStr) === String(currentUserId);

                    // Helper to get sender details for group chat
                    const getSenderDetails = (senderId: string) => {
                        if (!user.isGroup || !user.participants) return null;

                        // Try finding precise match first
                        const p = user.participants.find(p => {
                            // Handle if p.participantId is populated object OR just string ID
                            const pId = (p.participantId as any)._id || p.participantId;
                            // Compare as strings to be safe
                            return String(pId) === String(senderId);
                        });

                        return p?.participantId;
                    };

                    const senderDetails = !isMe && user.isGroup ? getSenderDetails(senderIdStr) : null;
                    const showHeader = !isMe && user.isGroup && senderDetails;

                    return (
                        <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            {showHeader && (
                                <span className={`text-xs mb-1 ml-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {senderDetails?.name || (senderDetails as any)?.fullName || 'User'}
                                </span>
                            )}
                            <div className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'} max-w-[80%]`}>
                                {showHeader && (
                                    <img
                                        src={senderDetails?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(senderDetails?.name || 'User')}&background=random`}
                                        alt={senderDetails?.name}
                                        className="w-6 h-6 rounded-full mt-1"
                                    />
                                )}
                                <div className={`rounded-2xl p-3 shadow-sm ${isMe
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
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

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
                        placeholder="Type your message..."
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
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}
