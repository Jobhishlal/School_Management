import { useState, useEffect, useRef } from 'react';
import { getChatHistory, markMessagesRead, type ChatUser, type ChatMessage } from '../../../services/ChatService';
import { Send, Paperclip, MoreVertical, Check, CheckCheck, Trash2, Mic, Loader2 } from 'lucide-react';
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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    // Recording State
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Edit state
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

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

        const handleMessageDeleted = (data: { messageId: string, isDeleted: boolean }) => {
            setMessages(prev => prev.map(msg =>
                msg._id === data.messageId ? { ...msg, isDeleted: true, content: 'This message was deleted' } : msg
            ));
        };

        socket.on('receive_private_message', handleReceiveMessage);
        socket.on('message_sent_confirmation', handleMessageSentConfirmation);
        socket.on('messages_read', handleMessagesRead);
        socket.on('typing_started', handleTypingStarted);
        socket.on('typing_stopped', handleTypingStopped);
        socket.on('message_updated', handleMessageUpdated);
        socket.on('message_deleted', handleMessageDeleted);

        return () => {
            socket.off('receive_private_message', handleReceiveMessage);
            socket.off('message_sent_confirmation', handleMessageSentConfirmation);
            socket.off('messages_read', handleMessagesRead);
            socket.off('typing_started', handleTypingStarted);
            socket.off('typing_stopped', handleTypingStopped);
            socket.off('message_updated', handleMessageUpdated);
            socket.off('message_deleted', handleMessageDeleted);
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
        // Removed setEditContent as it was deleted
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

            const messageData = {
                senderId: currentUserId,
                senderModel: 'Students',
                receiverId: teacher._id,
                receiverModel: teacher.isGroup ? 'Conversation' : 'Teacher',
                content: url,
                type: 'audio' // Ensure backend supports 'audio'
            };

            if (socket) socket.emit('send_private_message', messageData);

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

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const response = await api.post('/chat/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const { url } = response.data.data;
            const messageType = file.type.startsWith('image/') ? 'image' : 'file';

            const messageData = {
                senderId: currentUserId,
                senderModel: 'Students',
                receiverId: teacher._id,
                receiverModel: teacher.isGroup ? 'Conversation' : 'Teacher',
                content: url,
                type: messageType
            };

            if (socket) socket.emit('send_private_message', messageData);

        } catch (error) {
            console.error("File upload failed", error);
            alert("File upload failed");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
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
                <div className="flex items-center gap-2">
                    <a
                        href={msg.content.replace('/upload/', '/upload/fl_attachment/')}
                        className="flex items-center gap-2 text-blue-500 hover:text-blue-600 break-all group-hover/msg:underline"
                        download
                    >
                        <Paperclip size={16} className="min-w-[16px]" />
                        <span>
                            {decodeURIComponent(msg.content.split('/').pop()?.replace(/^\d+-/, '') || 'Attachment')}
                        </span>
                    </a>
                </div>
            );
        }
        if (msg.type === 'audio') {
            return (
                <div className="min-w-[200px]">
                    <audio controls src={msg.content} className="w-full h-8" />
                </div>
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
        <div className={`flex flex-col h-full ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
            {/* Header */}
            <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-3">
                    <img src={teacher.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=random`} alt={teacher.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                        <h3 className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{teacher.name}</h3>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{teacher.isOnline ? 'Online' : 'Offline'}</p>
                    </div>
                </div>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                    <MoreVertical size={20} className="text-slate-500" />
                </button>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => {
                    const isMe = msg.senderId === currentUserId;
                    const showHeader = idx === 0 || messages[idx - 1].senderId !== msg.senderId;
                    const senderDetails = isMe ? null : teacher;
                    // Editable & Deletable checks
                    const isEditable = isMe && msg.type === 'text' && (Date.now() - new Date(msg.timestamp).getTime() < 5 * 60 * 1000);
                    const isDeletable = isMe && !(msg as any).isDeleted;

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

                                    {(isEditable || isDeletable) && !(msg as any).isDeleted && editingMessageId !== msg._id && (
                                        <div className="absolute -top-2 -left-8 flex gap-1 bg-white dark:bg-slate-800 rounded-full shadow-sm opacity-0 group-hover/msg:opacity-100 transition p-1 z-10 w-auto">
                                            {isEditable && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleEditClick(msg); }}
                                                    className="text-slate-500 hover:text-blue-500 p-1"
                                                    title="Edit"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                                </button>
                                            )}
                                            {isDeletable && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteClick(msg._id); }}
                                                    className="text-slate-500 hover:text-red-500 p-1"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            )}
                                        </div>
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

            {/* Editing Banner */}
            {
                editingMessageId && (
                    <div className={`px-4 py-2 text-sm flex justify-between items-center ${isDark ? 'bg-slate-800 text-slate-300 border-t border-slate-700' : 'bg-slate-100 text-slate-600 border-t border-slate-200'}`}>
                        <span>Editing message...</span>
                        <button onClick={handleCancelEdit} className="text-blue-500 hover:underline">Cancel</button>
                    </div>
                )
            }


            <div className={`p-4 border-t ${isDark ? 'border-slate-700 bg-slate-800/30' : 'border-slate-200 bg-white'}`}>
                {isRecording ? (
                    <div className="flex items-center gap-4 w-full">
                        <div className="flex-1 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-500 animate-pulse">
                            <div className="w-3 h-3 bg-red-500 rounded-full" />
                            <span className="text-sm font-medium">Recording {formatDuration(recordingDuration)}</span>
                        </div>
                        <button
                            onClick={handleCancelRecording}
                            className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
                            title="Cancel"
                        >
                            <Trash2 size={20} />
                        </button>
                        <button
                            onClick={handleStopRecording}
                            className="p-3 rounded-xl bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30"
                            title="Send Voice Message"
                        >
                            {uploading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                        </button>
                    </div>
                ) : (
                    <>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileSelect}
                            accept="image/*,video/*,.pdf,.doc,.docx"
                        />
                        <form onSubmit={handleSendMessage} className="flex gap-2 w-full">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className={`p-3 rounded-xl transition ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                            >
                                {uploading ? <Loader2 size={20} className="animate-spin" /> : <Paperclip size={20} />}
                            </button>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => {
                                    setNewMessage(e.target.value);
                                    if (socket && !editingMessageId) {
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
                            {newMessage.trim() ? (
                                <button
                                    type="submit"
                                    className="p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition"
                                >
                                    {editingMessageId ? <Check size={20} /> : <Send size={20} />}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleStartRecording}
                                    disabled={uploading}
                                    className={`p-3 rounded-xl transition hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500`}
                                    title="Record Voice Message"
                                >
                                    <Mic size={20} />
                                </button>
                            )}
                        </form>
                    </>
                )}
            </div>
        </div >
    );
}
