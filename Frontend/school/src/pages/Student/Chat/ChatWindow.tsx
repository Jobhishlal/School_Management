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

    // Edit state
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');

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

        const handleMessageUpdated = (updatedMessage: ChatMessage) => {
            setMessages(prev => prev.map(msg =>
                msg._id === updatedMessage._id ? updatedMessage : msg
            ));
        };

        socket.on('receive_private_message', handleReceiveMessage);
        socket.on('message_sent_confirmation', handleMessageSentConfirmation);
        socket.on('messages_read', handleMessagesRead);
        socket.on('typing_started', handleTypingStarted);
        socket.on('typing_stopped', handleTypingStopped);
        socket.on('message_updated', handleMessageUpdated);

        return () => {
            socket.off('receive_private_message', handleReceiveMessage);
            socket.off('message_sent_confirmation', handleMessageSentConfirmation);
            socket.off('messages_read', handleMessagesRead);
            socket.off('typing_started', handleTypingStarted);
            socket.off('typing_stopped', handleTypingStopped);
            socket.off('message_updated', handleMessageUpdated);
        };
    }, [socket, teacher._id, currentUserId]);

    // Edit Handlers
    const handleEditClick = (msg: ChatMessage) => {
        setEditingMessageId(msg._id);
        setNewMessage(msg.content);
        // Focus the main input
        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (input) input.focus();
    };

    const handleCancelEdit = () => {
        setEditingMessageId(null);
        setNewMessage('');
        setEditContent(''); // Clear legacy state if any
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket) return;

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

        // Handle Send New
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

    // ... (renderMessageContent no longer contains inline input)
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
        return (
            <div className="group relative">
                <p className="text-sm break-words">{msg.content}</p>
                {(msg as any).isEdited && <span className="text-[10px] opacity-60 italic ml-1">(edited)</span>}
            </div>
        );
    };

    // ... inside return, add the Editing Indicator above the input
    // Locate the input div wrapper

    // ... inside the mapping loop ...
    // Message Time Edit Check
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
                    {isEditable && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleEditClick(msg); }}
                            className="absolute -top-2 -left-2 bg-slate-100 text-slate-600 p-1 rounded-full opacity-0 group-hover/msg:opacity-100 transition shadow-sm hover:bg-white"
                            title="Edit Message"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
})}
<div ref={messagesEndRef} />
{
    isTeacherTyping && (
        <div className="flex justify-start">
            <div className={`px-4 py-2 rounded-2xl text-xs italic ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
                }`}>
                Typing...
            </div>
        </div>
    )
}
            </div >

    {/* Editing Banner */ }
{
    editingMessageId && (
        <div className={`px-4 py-2 text-sm flex justify-between items-center ${isDark ? 'bg-slate-800 text-slate-300 border-t border-slate-700' : 'bg-slate-100 text-slate-600 border-t border-slate-200'}`}>
            <span>Editing message...</span>
            <button onClick={handleCancelEdit} className="text-blue-500 hover:underline">Cancel</button>
        </div>
    )
}

{/* Input */ }
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
                if (socket && !editingMessageId) { // Verify typing logic only if not editing? Or both?
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
        </div >
    );
}
