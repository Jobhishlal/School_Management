import React, { useState, useEffect, useRef } from 'react';
import { Send, FileText, Paperclip, MoreVertical, Phone, Video, Check, CheckCheck, Smile, Mic, X, Trash2 } from 'lucide-react';
import { type ChatMessage, type ChatUser, getChatHistory, markMessagesRead, uploadFile } from '../../../services/ChatService';
import api from '../../../services/api';
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';

interface TeacherChatWindowProps {
    user: ChatUser;
    isDark: boolean;
    socket: any;
    startNew?: boolean;
    onBack: () => void;
}

export default function TeacherChatWindow({ user, isDark, socket, onBack }: TeacherChatWindowProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [otherUserTyping, setOtherUserTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [currentUserId, setCurrentUserId] = useState<string>('');


    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const recordingTimerRef = useRef<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('teacherAccessToken') || localStorage.getItem('accessToken');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                setCurrentUserId(String(decoded.id || decoded.userId || decoded._id || ''));
            } catch (error) {
                console.error("Invalid token", error);
            }
        }
    }, []);

    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    useEffect(() => {
        if (user?._id) {
            loadChatHistory();
            markMessagesRead(user._id).catch(console.error);
        }
    }, [user?._id]);

    useEffect(() => {
        scrollToBottom('auto');
    }, [messages]);

    const loadChatHistory = async () => {
        try {
            const history = await getChatHistory(user._id);
            setMessages(history);
        } catch (error) {
            console.error("Error loading history", error);
        }
    };

    useEffect(() => {
        if (!socket || !user?._id) return;

        const handleReceiveMessage = (message: any) => {
            console.log("📩 TeacherChatWindow received socket message:", message);
            const senderId = String(message.senderId?._id || message.senderId);
            const receiverId = String(message.receiverId?._id || message.receiverId);

            console.log(`🔍 Comparing IDs: Sender=${senderId}, Receiver=${receiverId}, TargetUser=${user._id}, Me=${currentUserId}`);

            const isFromCurrentTarget = (message.receiverModel === 'Conversation' && String(message.receiverId) === String(user._id)) ||
                (message.receiverModel !== 'Conversation' && (senderId === String(user._id) || (senderId === currentUserId && receiverId === String(user._id))));

            console.log("✅ Is from current target?", isFromCurrentTarget);

            if (isFromCurrentTarget) {
                setMessages(prev => {
                    if (prev.some(m => String(m._id) === String(message._id))) return prev;
                    return [...prev, message];
                });
                if (senderId !== currentUserId) {
                    markMessagesRead(user._id).catch(console.error);
                }
            }
        };

        const handleTyping = (data: any) => {
            if (String(data.from || data.senderId) === String(user._id)) {
                setOtherUserTyping(true);
                setTimeout(() => setOtherUserTyping(false), 3000);
            }
        };

        socket.on('receive_message', handleReceiveMessage);
        socket.on('receive_private_message', handleReceiveMessage);
        socket.on('typing_started', handleTyping);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
            socket.off('receive_private_message', handleReceiveMessage);
            socket.off('typing_started', handleTyping);
        };
    }, [socket, user?._id, currentUserId]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim() || !user?._id) return;

        const content = newMessage.trim();
        setNewMessage('');

        try {
            const response = await api.post('/chat/send', {
                receiverId: user._id,
                receiverRole: user.role || 'student',
                content,
                type: 'text'
            });
            const savedMsg = response.data.data;
            setMessages(prev => {
                if (prev.some(m => String(m._id) === String(savedMsg._id))) return prev;
                return [...prev, savedMsg];
            });
        } catch (error) {
            console.error("Failed to send", error);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user?._id) return;

        try {
            const fileUrl = await uploadFile(file);
            const response = await api.post('/chat/send', {
                receiverId: user._id,
                receiverRole: user.role || 'student',
                content: fileUrl,
                type: file.type.startsWith('image/') ? 'image' : 'file'
            });
            const savedMsg = response.data.data;
            setMessages(prev => [...prev, savedMsg]);
        } catch (error) {
            console.error("Upload failed", error);
        }
    };

    const formatDuration = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioFile = new File([audioBlob], 'voice-message.webm', { type: 'audio/webm' });
                await uploadAndSendAudio(audioFile);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingDuration(0);
            recordingTimerRef.current = setInterval(() => {
                setRecordingDuration(prev => prev + 1);
            }, 1000);
        } catch (error) {
            console.error("Mic error:", error);
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
        try {
            const fileUrl = await uploadFile(file);
            const response = await api.post('/chat/send', {
                receiverId: user._id,
                receiverRole: user.role || 'student',
                content: fileUrl,
                type: 'audio'
            });
            setMessages(prev => [...prev, response.data.data]);
        } catch (error) {
            console.error("Audio failed", error);
        } finally {
            setRecordingDuration(0);
        }
    };

    return (
        <div className={`flex flex-col h-full w-full relative ${isDark ? 'bg-[#0b1014]' : 'bg-[#f0f2f5]'}`}>
            {/* Redesigned Premium Header */}
            <div className={`flex items-center justify-between px-4 py-3 z-20 shadow-sm border-b backdrop-blur-md ${isDark ? 'bg-[#0f151a]/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="md:hidden p-2 -ml-2 hover:bg-slate-200/50 rounded-full transition">
                        <X size={18} />
                    </button>
                    <div className="relative">
                        <img
                            src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&bold=true`}
                            alt={user.name}
                            className="w-9 h-9 rounded-xl object-cover shadow-sm ring-2 ring-blue-500/10"
                        />
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${isDark ? 'border-[#0f151a]' : 'border-white'} ${user.isOnline ? 'bg-green-500' : 'bg-slate-400'}`} />
                    </div>
                    <div>
                        <h3 className={`font-bold text-[15px] leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.name}</h3>
                        <p className={`text-[10px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            {otherUserTyping ? (
                                <span className="text-blue-500 animate-pulse font-bold tracking-wide italic">typing...</span>
                            ) : user.isOnline ? 'Active Now' : 'Last seen recently'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className={`p-2.5 rounded-xl transition-all active:scale-90 ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                        <Phone size={20} />
                    </button>
                    <button className={`p-2.5 rounded-xl transition-all active:scale-90 ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                        <Video size={20} />
                    </button>
                    <div className="w-[1px] h-6 mx-1 bg-slate-300/20" />
                    <button className={`p-2.5 rounded-xl transition-all active:scale-90 ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            {/* Chat Messages Area */}
            <div className={`flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth custom-scrollbar ${isDark ? 'bg-[#0b1014]' : 'bg-[#f4f7f9]'} relative`}>
                <div className="flex flex-col gap-3 max-w-5xl mx-auto">
                    {messages.map((msg, idx) => {
                        const isMe = String((msg.senderId as any)?._id || msg.senderId) === currentUserId;
                        const showAvatar = !isMe && (!messages[idx - 1] || String((messages[idx - 1].senderId as any)?._id || messages[idx - 1].senderId) !== String((msg.senderId as any)?._id || msg.senderId));

                        return (
                            <div key={msg._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1 duration-300`}>
                                {!isMe && (
                                    <div className="w-8 mr-2 flex-shrink-0 self-end mb-4">
                                        {showAvatar && (
                                            <img
                                                src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                                                className="w-8 h-8 rounded-xl object-cover shadow-sm ring-2 ring-white/10"
                                                alt="avatar"
                                            />
                                        )}
                                    </div>
                                )}
                                <div className={`max-w-[85%] md:max-w-[65%] lg:max-w-[60%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                    <div className={`relative px-3 py-2 rounded-xl text-[14px] shadow-sm transition-all hover:shadow-md ${isMe
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : isDark ? 'bg-[#1a2329] text-slate-100 rounded-tl-none border border-slate-700/30' : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/50'
                                        }`}>
                                        {msg.type === 'image' ? (
                                            <div className="group relative rounded-xl overflow-hidden cursor-pointer bg-slate-100/10" onClick={() => window.open(msg.content, '_blank')}>
                                                <img
                                                    src={msg.content}
                                                    alt="attachment"
                                                    className="max-w-full max-h-[300px] object-contain rounded-xl transition-transform group-hover:scale-[1.01]"
                                                />
                                            </div>
                                        ) : msg.type === 'file' ? (
                                            <a href={msg.content} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-1">
                                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                                    <FileText size={20} />
                                                </div>
                                                <div className="text-sm font-medium pr-2">Document Attachment</div>
                                            </a>
                                        ) : msg.type === 'audio' ? (
                                            <div className="min-w-[220px] py-1">
                                                <audio controls src={msg.content} className="w-full h-8" />
                                            </div>
                                        ) : (
                                            <p className="whitespace-pre-wrap leading-relaxed break-words">{msg.content}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-1.5 px-1 opacity-50">
                                        <span className="text-[10px] font-medium tracking-tight">
                                            {msg.timestamp ? dayjs(msg.timestamp).format('HH:mm') : ''}
                                        </span>
                                        {isMe && (
                                            <span className="flex">
                                                {msg.read ? <CheckCheck size={14} className="text-blue-400" /> : <Check size={14} />}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </div>

            {/* Input Overlay for Recording */}
            {isRecording && (
                <div className={`px-4 md:px-6 py-4 z-20 ${isDark ? 'bg-[#0f151a]/95' : 'bg-white/95'} backdrop-blur-md border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <div className="flex items-center gap-3 max-w-5xl mx-auto">
                        <div className="flex-1 flex items-center justify-between px-5 py-3 bg-red-500/5 rounded-2xl text-red-500 border border-red-500/10">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                <span className="text-xs font-bold tracking-widest uppercase">Recording</span>
                            </div>
                            <span className="text-sm font-mono font-bold">{formatDuration(recordingDuration)}</span>
                        </div>
                        <button
                            onClick={handleCancelRecording}
                            className={`p-3 rounded-xl transition-all active:scale-90 ${isDark ? 'bg-slate-800 text-slate-400 hover:text-red-400' : 'bg-slate-100 text-slate-500 hover:text-red-500'}`}
                        >
                            <Trash2 size={24} />
                        </button>
                        <button
                            onClick={handleStopRecording}
                            className="w-14 h-14 rounded-2xl bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all active:scale-90 shadow-lg shadow-red-500/20"
                        >
                            <Send size={24} />
                        </button>
                    </div>
                </div>
            )}

            {/* Standard Input Area */}
            {!isRecording && (
                <div className={`px-4 md:px-5 py-3 z-20 ${isDark ? 'bg-[#0f151a]/95' : 'bg-white/95'} backdrop-blur-md border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <form onSubmit={handleSendMessage} className="flex items-end gap-2.5 max-w-5xl mx-auto">
                        <div className="flex items-center gap-1 pb-1 flex-shrink-0">
                            <label className={`p-2.5 rounded-xl cursor-pointer transition-all hover:bg-slate-100 group ${isDark ? 'hover:bg-slate-800 text-slate-500' : 'text-slate-400'}`}>
                                <Paperclip size={22} className="group-hover:rotate-12 transition-transform" />
                                <input type="file" className="hidden" onChange={handleFileUpload} />
                            </label>
                            <button type="button" className={`p-2.5 rounded-xl transition-all hover:bg-slate-100 ${isDark ? 'hover:bg-slate-800 text-slate-500' : 'text-slate-400'}`}>
                                <Smile size={22} />
                            </button>
                        </div>

                        <div className={`flex-1 relative rounded-2xl transition-all border group shadow-sm ${isDark
                            ? 'bg-[#1a2329] border-slate-800 focus-within:border-blue-500/30'
                            : 'bg-slate-50 border-slate-200 focus-within:border-blue-400/30 focus-within:bg-white'
                            }`}>
                            <textarea
                                ref={inputRef}
                                rows={1}
                                value={newMessage}
                                onChange={(e) => {
                                    setNewMessage(e.target.value);
                                    if (socket) socket.emit('typing_start', { to: user._id });
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                placeholder="Write a message..."
                                className="w-full bg-transparent px-5 py-3.5 text-[15px] outline-none resize-none max-h-32 min-h-[52px]"
                            />
                        </div>

                        <div className="pb-1 flex-shrink-0">
                            {newMessage.trim() ? (
                                <button
                                    type="submit"
                                    className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all active:scale-90 shadow-lg shadow-blue-600/20"
                                >
                                    <Send size={20} className="-rotate-12 translate-x-0.5" />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleStartRecording}
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400 hover:text-blue-500'}`}
                                >
                                    <Mic size={22} />
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

        </div>
    );
}
