import { useState, useEffect, useRef } from 'react';
import { getChatHistory, markMessagesRead, type ChatUser, type ChatMessage } from '../../../services/ChatService';
import { Send, Paperclip, MoreVertical, Check, CheckCheck } from 'lucide-react';
import { Socket } from 'socket.io-client';
import api from '../../../services/api';

interface ChatWindowProps {
    teacher: ChatUser;
    isDark: boolean;
    socket: Socket | null;
}

export default function ChatWindow({ teacher, isDark, socket }: ChatWindowProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [currentUserId, setCurrentUserId] = useState<string>('');
    const [isTeacherTyping, setIsTeacherTyping] = useState(false);
    const typingTimeoutRef = useRef<any>(null);
    const isTypingRef = useRef(false);

    useEffect(() => {

        const token = localStorage.getItem('studentAccessToken');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setCurrentUserId(payload.id);
            } catch (e) {
                console.error("Invalid token", e);
            }
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const history = await getChatHistory(teacher._id);
                setMessages(history);
                scrollToBottom();
                markMessagesRead(teacher._id);
            } catch (error) {
                console.error("Failed to load history", error);
            }
        };
        loadHistory();
    }, [teacher._id]);

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (message: ChatMessage) => {
            if (message.senderId === teacher._id || message.receiverId === teacher._id) {
                setMessages(prev => [...prev, message]);
                scrollToBottom();
                if (message.senderId === teacher._id) {
                    markMessagesRead(teacher._id);
                }
            }
        };

        const handleMessageSentConfirmation = (message: ChatMessage) => {

            setMessages(prev => {
                if (prev.some(m => m._id === message._id)) return prev;
                return [...prev, message];
            });
            scrollToBottom();
        };

        const handleMessagesRead = (data: { readerId: string }) => {
            if (data.readerId === teacher._id) {
                setMessages(prev => prev.map(msg =>
                    (msg.senderId === currentUserId && !msg.read)
                        ? { ...msg, read: true }
                        : msg
                ));
            }
        };

        const handleTypingStarted = (data: { from: string }) => {
            if (data.from === teacher._id) setIsTeacherTyping(true);
        };

        const handleTypingStopped = (data: { from: string }) => {
            if (data.from === teacher._id) setIsTeacherTyping(false);
        };

        socket.on('receive_private_message', handleReceiveMessage);
        socket.on('message_sent_confirmation', handleMessageSentConfirmation);
        socket.on('messages_read', handleMessagesRead);
        socket.on('typing_started', handleTypingStarted);
        socket.on('typing_stopped', handleTypingStopped);

        return () => {
            socket.off('receive_private_message', handleReceiveMessage);
            socket.off('message_sent_confirmation', handleMessageSentConfirmation);
            socket.off('messages_read', handleMessagesRead);
            socket.off('typing_started', handleTypingStarted);
            socket.off('typing_stopped', handleTypingStopped);
        };
    }, [socket, teacher._id, currentUserId]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket) return;

        const messageData = {
            senderId: currentUserId,
            senderModel: 'Students',
            receiverId: teacher._id,
            receiverModel: teacher.isGroup ? 'Conversation' : 'Teacher',
            content: newMessage,
        };

        socket.emit('send_private_message', messageData);



        setNewMessage('');
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
                receiverId: teacher._id,
                receiverRole: teacher.isGroup ? 'Conversation' : 'teacher',
                content: url,
                type: type
            };


            const messageData = {
                senderId: currentUserId,
                senderModel: 'Students',
                receiverId: teacher._id,
                receiverModel: teacher.isGroup ? 'Conversation' : 'Teacher',
                content: url,
                type: type
            };
            socket?.emit('send_private_message', messageData);



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
            {/* Header */}
            <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white'}`}>
                {/* ... existing header ... */}
                <div className="flex items-center gap-3">
                    <img
                        src={teacher.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=random`}
                        alt={teacher.name}
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{teacher.name}</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Online</span>
                        </div>
                    </div>
                </div>
                <button className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <MoreVertical size={20} />
                </button>
            </div>

            {/* Messages */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDark ? 'bg-[#0f151a]' : 'bg-slate-50'}`}>
                {messages.map((msg, idx) => {
                    // Robust comparison for isMe
                    const senderIdStr = typeof msg.senderId === 'object' ? (msg.senderId as any)._id : msg.senderId;
                    const isMe = String(senderIdStr) === String(currentUserId);

                    // Helper to get sender details for group chat
                    const getSenderDetails = (senderId: string) => {
                        if (!teacher.isGroup || !teacher.participants) return null; // Not needed for 1-on-1 (it's either me or teacher)

                        // For group, find in participants
                        const p = teacher.participants.find(p => {
                            // Handle if p.participantId is populated object OR just string ID
                            const pId = (p.participantId as any)._id || p.participantId;
                            return String(pId) === String(senderId);
                        });
                        return p?.participantId;
                    };

                    const senderDetails = !isMe && teacher.isGroup ? getSenderDetails(senderIdStr) : null;
                    const showHeader = !isMe && teacher.isGroup && senderDetails;

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
                {isTeacherTyping && (
                    <div className="flex justify-start">
                        <div className={`px-4 py-2 rounded-2xl text-xs italic ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
                            }`}>
                            Typing...
                        </div>
                    </div>
                )}
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
                        onChange={(e) => {
                            setNewMessage(e.target.value);
                            if (socket) {
                                if (!isTypingRef.current) {
                                    isTypingRef.current = true;
                                    socket.emit('typing_start', { to: teacher._id });
                                }
                                if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                                typingTimeoutRef.current = setTimeout(() => {
                                    isTypingRef.current = false;
                                    socket.emit('typing_stop', { to: teacher._id });
                                }, 2000);
                            }
                        }}
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
