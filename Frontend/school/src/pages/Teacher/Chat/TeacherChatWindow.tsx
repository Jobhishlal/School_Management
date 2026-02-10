import { useState, useEffect, useRef } from 'react';
import { getChatHistory, markMessagesRead, type ChatUser, type ChatMessage } from '../../../services/ChatService';
import { Send, Paperclip, Check, CheckCheck, Trash2, Mic, Loader2, ArrowLeft } from 'lucide-react';
import { Socket } from 'socket.io-client';
import api from '../../../services/api';
import { jwtDecode } from 'jwt-decode';


interface TeacherChatWindowProps {
    user: ChatUser;
    isDark: boolean;
    socket: Socket | null;
    startNew?: boolean;
    onBack?: () => void;
}

export default function TeacherChatWindow({ user, isDark, socket, onBack }: TeacherChatWindowProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [currentUserId, setCurrentUserId] = useState<string>('');
    const [isStudentTyping, setIsStudentTyping] = useState(false);
    const isTypingRef = useRef(false);
    const typingTimeoutRef = useRef<any>(null);

    // Recording State
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Edit state
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

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
            // ... existing checks
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

            // Check if message should be added to this window
            const receiverIdStr = typeof message.receiverId === 'object' ? (message.receiverId as any)._id : message.receiverId;
            const isTargetedMessage =
                String(msgSenderId) === String(user._id) ||
                String(receiverIdStr) === String(user._id) ||
                (user.isGroup && String(receiverIdStr) === String(user._id));

            if (isTargetedMessage) {
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

        const handleTypingStarted = (data: { from: string }) => {
            if (data.from === user._id) setIsStudentTyping(true);
        };

        const handleTypingStopped = (data: { from: string }) => {
            if (data.from === user._id) setIsStudentTyping(false);
        };

        socket.on('receive_message', handleReceiveMessage);
        socket.on('messages_read', handleMessagesRead);
        socket.on('message_updated', handleMessageUpdated);
        socket.on('message_deleted', handleMessageDeleted);
        socket.on('typing_started', handleTypingStarted);
        socket.on('typing_stopped', handleTypingStopped);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
            socket.off('messages_read', handleMessagesRead);
            socket.off('message_updated', handleMessageUpdated);
            socket.off('message_deleted', handleMessageDeleted);
            socket.off('typing_started', handleTypingStarted);
            socket.off('typing_stopped', handleTypingStopped);
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
        console.log("Deleting message with ID:", msgId);
        if (!msgId) {
            console.error("Cannot delete: msgId is missing");
            return;
        }
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

    // --- Voice Recording Logic ---
    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioFile = new File([audioBlob], 'voice-message.webm', { type: 'audio/webm' });

                // Upload audio
                await uploadAndSendAudio(audioFile);

                // Stop inputs
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingDuration(0);
            recordingTimerRef.current = setInterval(() => {
                setRecordingDuration(prev => prev + 1);
            }, 1000);

        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Cannot access microphone. Please allow permissions.");
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
        }
    };

    const handleCancelRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            // Prevent upload by nullifying onstop
            mediaRecorderRef.current.onstop = null;
            mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
            mediaRecorderRef.current.stop();

            setIsRecording(false);
            if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
            setRecordingDuration(0);
        }
    };

    const uploadAndSendAudio = async (file: File) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post('/chat/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const { url } = response.data.data;

            const payload = {
                receiverId: user._id,
                receiverRole: user.isGroup ? 'Conversation' : 'student',
                content: url,
                type: 'audio' // Ensure backend supports saving this type or maps it
            };

            // Use api.post /chat/send to ensure consistent saving flow as text messages
            const sendResponse = await api.post('/chat/send', payload);
            const message = sendResponse.data.data;

            setMessages(prev => [...prev, message]);
            scrollToBottom();

        } catch (error) {
            console.error("Audio upload failed", error);
            alert("Failed to send voice message");
        } finally {
            setUploading(false);
            setRecordingDuration(0);
        }
    };

    const formatDuration = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
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
                        className="max-w-[200px] md:max-w-xs rounded-lg border border-slate-200 dark:border-slate-600"
                        loading="lazy"
                    />
                </div>
            );
        }
        if (msg.type === 'file') {
            return (
                <div className="flex items-center gap-2">
                    <a
                        href={msg.content.replace('/upload/', '/upload/fl_attachment/')}
                        className="flex items-center gap-2 text-blue-500 hover:text-blue-600 break-all group-hover/msg:underline"
                        download
                    >
                        <Paperclip size={16} className="min-w-[16px]" />
                        <span className="text-sm md:text-base">
                            {decodeURIComponent(msg.content.split('/').pop()?.replace(/^\d+-/, '') || 'Attachment')}
                        </span>
                    </a>
                </div>
            );
        }
        if (msg.type === 'audio') {
            return (
                <div className="min-w-[180px] md:min-w-[240px]">
                    <audio controls src={msg.content} className="w-full h-8" />
                </div>
            );
        }
        return (
            <div className="group relative">
                <p className="text-sm md:text-base break-words">{msg.content}</p>
                {(msg as any).isEdited && <span className="text-[10px] opacity-60 italic ml-1">(edited)</span>}
            </div>
        );
    };

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden">
            {/* Header */}
            <div className={`p-3 md:p-4 border-b flex items-center justify-between shadow-sm z-10 ${isDark ? 'border-slate-700 bg-slate-800/80' : 'border-slate-200 bg-white/80'} backdrop-blur-md`}>
                <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className={`p-2 rounded-full md:hidden transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <img
                        src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || (user as any).fullName)}&background=random`}
                        alt={user.name || (user as any).fullName}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover shadow-sm"
                    />
                    <div className="min-w-0">
                        <h3 className={`font-bold text-sm md:text-base truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {user.name || (user as any).fullName}
                        </h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                            <span className={`text-[10px] md:text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Online</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 md:space-y-6 ${isDark ? 'bg-[#0f151a]' : 'bg-slate-50'}`}>
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

                    // Editable & Deletable checks
                    const messageTimeDiff = Date.now() - new Date(msg.timestamp).getTime();
                    const isEditable = isMe && msg.type === 'text' && (messageTimeDiff < 5 * 60 * 1000);
                    const isDeletable = isMe && !(msg as any).isDeleted && (messageTimeDiff < 5 * 60 * 1000);

                    return (
                        <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group/msg`}>
                            {showHeader && (
                                <span className={`text-[10px] md:text-xs mb-1 ml-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {senderDetails?.name || (senderDetails as any)?.fullName || 'User'}
                                </span>
                            )}
                            <div className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'} max-w-[85%] md:max-w-[75%]`}>
                                {showHeader && (
                                    <img
                                        src={senderDetails?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(senderDetails?.name || (senderDetails as any)?.fullName || 'User')}&background=random`}
                                        alt={senderDetails?.name || (senderDetails as any)?.fullName}
                                        className="w-5 h-5 md:w-6 md:h-6 rounded-full mt-1 object-cover"
                                    />
                                )}
                                <div className={`relative rounded-2xl px-3 py-2 md:px-4 md:py-3 shadow-sm ${isMe
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : (isDark ? 'bg-slate-700 text-slate-200 rounded-bl-none' : 'bg-white text-slate-800 rounded-bl-none border border-slate-200/50')
                                    }`}>
                                    {renderMessageContent(msg)}
                                    <div className="flex items-center justify-end gap-1 mt-1 opacity-60">
                                        <span className="text-[9px] md:text-[10px]">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                        </span>
                                        {isMe && (
                                            msg.read ? <CheckCheck size={12} className="text-blue-200" /> : <Check size={12} className="text-slate-300" />
                                        )}
                                    </div>

                                    {(isEditable || isDeletable) && editingMessageId !== msg._id && !(msg as any).isDeleted && (
                                        <div className={`absolute top-0 ${isMe ? '-left-16' : '-right-16'} flex gap-1 bg-white dark:bg-slate-800 rounded-lg shadow-md opacity-0 group-hover/msg:opacity-100 transition-all duration-200 p-1 z-10 border dark:border-slate-700`}>
                                            {isEditable && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleEditClick(msg); }}
                                                    className="text-slate-500 hover:text-blue-500 p-1.5 transition-colors"
                                                    title="Edit"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                                </button>
                                            )}
                                            {isDeletable && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteClick(msg._id); }}
                                                    className="text-slate-500 hover:text-red-500 p-1.5 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                {isStudentTyping && (
                    <div className="flex justify-start mb-4">
                        <div className={`px-4 py-2 rounded-2xl text-xs italic ${isDark ? 'bg-slate-700/50 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                            Student is typing...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Editing Banner */}
            {editingMessageId && (
                <div className={`px-4 py-2 text-xs md:text-sm flex justify-between items-center animate-in slide-in-from-bottom-full duration-200 ${isDark ? 'bg-slate-800 text-slate-300 border-t border-slate-700' : 'bg-blue-50 text-blue-700 border-t border-blue-100'}`}>
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-blue-500 rounded-full" />
                        <span>Editing message...</span>
                    </div>
                    <button onClick={handleCancelEdit} className="font-semibold hover:underline">Cancel</button>
                </div>
            )}

            {/* Input Overlay for Recording */}
            {isRecording && (
                <div className={`absolute bottom-0 inset-x-0 p-3 md:p-4 z-20 animate-in slide-in-from-bottom-full duration-200 ${isDark ? 'bg-slate-900' : 'bg-white'} border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    <div className="flex items-center gap-2 md:gap-4 w-full">
                        <div className="flex-1 flex items-center justify-between px-4 py-3 bg-red-50 dark:bg-red-900/10 rounded-2xl text-red-500 border border-red-100 dark:border-red-900/20">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                <span className="text-xs md:text-sm font-bold tracking-tight">RECORDING</span>
                            </div>
                            <span className="text-sm font-mono font-bold">{formatDuration(recordingDuration)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleCancelRecording}
                                className={`p-3 rounded-2xl transition-colors ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-500'}`}
                            >
                                <Trash2 size={20} />
                            </button>
                            <button
                                onClick={handleStopRecording}
                                className="p-3 rounded-2xl bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/40 transition-all active:scale-95"
                            >
                                {uploading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Standard Input Area */}
            {!isRecording && (
                <div className={`p-3 md:p-4 border-t transition-all ${isDark ? 'border-slate-700 bg-slate-800/20' : 'border-slate-200 bg-white'}`}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileSelect}
                        accept="image/*,video/*,.pdf,.doc,.docx"
                    />
                    <form onSubmit={handleSendMessage} className="flex items-end gap-2 w-full max-w-5xl mx-auto">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className={`p-3 rounded-2xl transition-all ${isDark ? 'bg-slate-700/50 hover:bg-slate-700 text-slate-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-500'} active:scale-90`}
                        >
                            {uploading ? <Loader2 size={20} className="animate-spin" /> : <Paperclip size={20} />}
                        </button>

                        <div className="flex-1 min-w-0 relative">
                            <textarea
                                value={newMessage}
                                onChange={(e) => {
                                    setNewMessage(e.target.value);
                                    if (socket && !editingMessageId) {
                                        if (!isTypingRef.current) {
                                            isTypingRef.current = true;
                                            socket.emit('typing_start', { to: user._id });
                                        }
                                        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                                        typingTimeoutRef.current = setTimeout(() => {
                                            isTypingRef.current = false;
                                            socket.emit('typing_stop', { to: user._id });
                                        }, 2000);
                                    }
                                }}
                                placeholder={editingMessageId ? "Edit your message..." : "Type your message..."}
                                rows={1}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e as any);
                                    }
                                }}
                                className={`w-full p-3 max-h-32 rounded-2xl outline-none resize-none transition-all ${isDark
                                    ? 'bg-slate-700/50 text-white placeholder-slate-500 focus:bg-slate-700 border border-transparent focus:border-blue-500/30'
                                    : 'bg-slate-100 text-slate-900 placeholder-slate-400 focus:bg-white border border-transparent focus:border-blue-500/30'
                                    }`}
                                style={{ height: 'auto', minHeight: '48px' }}
                            />
                        </div>

                        {newMessage.trim() ? (
                            <button
                                type="submit"
                                className="p-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition-all active:scale-90 flex-shrink-0"
                            >
                                {editingMessageId ? <Check size={20} /> : <Send size={20} />}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleStartRecording}
                                disabled={uploading}
                                className={`p-3 rounded-2xl transition-all ${isDark ? 'bg-slate-700/50 hover:bg-slate-700 text-slate-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-500'} active:scale-90 flex-shrink-0`}
                            >
                                <Mic size={20} />
                            </button>
                        )}
                    </form>
                </div>
            )}
        </div>
    );
}
