import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Youtube, Loader2, MessageSquare, Plus, Menu, X, Trash2, Sparkles, Clock } from 'lucide-react';
import { useTheme } from '../../../components/layout/ThemeContext';
import { askAIDoubt, getChatHistory, getChatSession, deleteChatSession } from '../../../services/studentAIService';
import { toast } from 'react-toastify';

interface Video {
    id: string;
    title: string;
    thumbnail: string;
    url: string;
}

interface Message {
    id: string;
    type: 'user' | 'ai';
    content: string;
    videos?: Video[];
    timestamp: Date;
}

interface ChatSession {
    id: string;
    title: string;
    updatedAt: string;
}

const StudentAIAssistant: React.FC = () => {
    const { isDark } = useTheme();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            type: 'ai',
            content: "Hello! I'm your AI Study Assistant. Ask me anything about your subjects, and I'll explain it to you and find relevant videos!",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
    const [history, setHistory] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(undefined);

    // Handle initial sidebar state on resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const data = await getChatHistory();
            if (data.success) {
                setHistory(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch history:", error);
        }
    };

    const loadSession = async (sessionId: string) => {
        setLoading(true);
        try {
            const data = await getChatSession(sessionId);
            if (data.success) {
                const session = data.data;
                const formattedMessages = session.messages.map((msg: any) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }));
                setMessages(formattedMessages);
                setCurrentSessionId(sessionId);
                if (window.innerWidth < 768) setSidebarOpen(false);
            }
        } catch (error) {
            console.error("Failed to load session:", error);
            toast.error("Could not load chat session");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
        e.stopPropagation();

        toast(
            ({ closeToast }) => (
                <div className="flex flex-col gap-2 p-1">
                    <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>Delete this chat?</p>
                    <div className="flex gap-2 justify-end">
                        <button
                            className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-xs font-bold hover:bg-gray-300 transition"
                            onClick={closeToast}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-red-500 text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-red-600 transition shadow-sm"
                            onClick={() => {
                                executeDeleteSession(sessionId);
                                closeToast();
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ),
            {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: false,
                theme: isDark ? "dark" : "light",
            }
        );
    };

    const executeDeleteSession = async (sessionId: string) => {
        try {
            const response = await deleteChatSession(sessionId);
            if (response.success) {
                toast.success("Chat deleted successfully");
                setHistory(prev => prev.filter(s => s.id !== sessionId));

                if (currentSessionId === sessionId) {
                    startNewChat();
                }
            } else {
                toast.error("Failed to delete chat");
            }
        } catch (error) {
            console.error("Failed to delete chat:", error);
            toast.error("Could not delete chat");
        }
    };

    const startNewChat = () => {
        setCurrentSessionId(undefined);
        setMessages([{
            id: '1',
            type: 'ai',
            content: "Hello! I'm your AI Study Assistant. Ask me anything about your subjects, and I'll explain it to you and find relevant videos!",
            timestamp: new Date()
        }]);
        if (window.innerWidth < 768) setSidebarOpen(false);
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await askAIDoubt(userMessage.content, currentSessionId);

            if (response.success) {
                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    type: 'ai',
                    content: response.data.answer,
                    videos: response.data.videos,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, aiMessage]);

                if (!currentSessionId && response.data.sessionId) {
                    setCurrentSessionId(response.data.sessionId);
                    fetchHistory();
                }
            } else {
                toast.error("Failed to get response");
            }
        } catch (error: any) {
            console.error("AI Error:", error);

            const errorMessage = error.response?.data?.message || "Something went wrong";

            if (errorMessage === "This content is not allowed.") {
                toast.error("this type content is not pssible to search here");
                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    type: 'ai',
                    content: "this type content is not pssible to search here",
                    timestamp: new Date()
                }]);
            } else {
                toast.error("Something went wrong. Please try again.");
                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    type: 'ai',
                    content: "I apologize, but I encountered an error while processing your request. Please try again later.",
                    timestamp: new Date()
                }]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={`flex h-[calc(100vh-1rem)] md:h-[calc(100vh-2rem)] max-w-7xl mx-auto rounded-xl md:rounded-2xl overflow-hidden shadow-2xl relative ${isDark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : "bg-gradient-to-br from-gray-50 via-white to-gray-50"}`}>

            {/* Mobile Menu Button - Fixed position relative to container */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`md:hidden absolute top-3 left-3 z-[60] p-2.5 rounded-xl shadow-lg backdrop-blur-md transition-all active:scale-95 ${isDark ? "bg-slate-800/90 text-white border border-slate-700" : "bg-white/90 text-gray-800 border border-gray-200"}`}
            >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar Overlay (Mobile) */}
            {sidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                absolute md:relative z-50 h-full
                ${sidebarOpen ? 'w-[280px] translate-x-0' : 'w-0 -translate-x-full md:w-0'}
                md:w-72 md:translate-x-0
                transition-all duration-300 flex-shrink-0 flex flex-col border-r backdrop-blur-sm
                ${isDark ? "bg-slate-900/95 border-slate-800" : "bg-white/95 border-gray-200"}
            `}>
                {/* Sidebar Header */}
                <div className="p-6 border-b border-inherit">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isDark ? "bg-gradient-to-br from-purple-600 to-blue-600" : "bg-gradient-to-br from-purple-500 to-blue-500"}`}>
                                <Sparkles size={20} className="text-white" />
                            </div>
                            <span className={`font-bold text-lg ${isDark ? "text-white" : "text-gray-800"}`}>
                                Study AI
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={startNewChat}
                        className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2 ${isDark ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500" : "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"}`}
                    >
                        <Plus size={18} />
                        New Chat
                    </button>
                </div>

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    <div className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? "text-slate-500" : "text-gray-500"}`}>
                        Recent Chats
                    </div>
                    {history.length === 0 ? (
                        <div className={`text-center py-12 px-4 ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                            <MessageSquare size={32} className="mx-auto mb-3 opacity-50" />
                            <p className="text-sm">No history yet</p>
                            <p className="text-xs mt-1">Start chatting to see your conversations here</p>
                        </div>
                    ) : (
                        history.map(session => (
                            <div
                                key={session.id}
                                onClick={() => loadSession(session.id)}
                                className={`group relative p-3.5 rounded-xl text-sm transition-all cursor-pointer ${currentSessionId === session.id
                                    ? isDark
                                        ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-2 border-purple-500/50"
                                        : "bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300"
                                    : isDark
                                        ? "hover:bg-slate-800/50 border-2 border-transparent"
                                        : "hover:bg-gray-100/70 border-2 border-transparent"
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <MessageSquare size={16} className={`flex-shrink-0 mt-0.5 ${currentSessionId === session.id ? (isDark ? "text-purple-400" : "text-purple-600") : (isDark ? "text-slate-400" : "text-gray-500")}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-medium truncate ${currentSessionId === session.id ? (isDark ? "text-white" : "text-gray-900") : (isDark ? "text-slate-300" : "text-gray-700")}`}>
                                            {session.title || "Untitled Chat"}
                                        </p>
                                        <div className={`flex items-center gap-1.5 mt-1 text-xs ${isDark ? "text-slate-500" : "text-gray-500"}`}>
                                            <Clock size={12} />
                                            <span>{new Date(session.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => handleDeleteSession(e, session.id)}
                                        className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all hover:bg-red-500 hover:text-white ${isDark ? "text-slate-500" : "text-gray-400"}`}
                                        title="Delete Chat"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 relative">
                {/* Header with Gradient */}
                <div className={`relative p-4 md:p-6 border-b overflow-hidden ${isDark ? "bg-gradient-to-r from-slate-900 via-purple-900/20 to-slate-900 border-slate-800" : "bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 border-purple-700"}`}>
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
                    </div>
                    <div className="relative flex items-center gap-3 md:gap-4 pl-10 md:pl-0">
                        <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl shadow-lg ${isDark ? "bg-gradient-to-br from-purple-600 to-blue-600" : "bg-white/20 backdrop-blur-sm"}`}>
                            <Bot className="text-white w-6 h-6 md:w-7 md:h-7" />
                        </div>
                        <div>
                            <h1 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                                AI Assistant
                                <Sparkles size={16} className="text-yellow-300 animate-pulse md:w-5 md:h-5" />
                            </h1>
                            <p className={`text-[10px] md:text-sm mt-0.5 ${isDark ? "text-purple-200" : "text-white/90"}`}>
                                Powered by Gemini & YouTube
                            </p>
                        </div>
                    </div>
                </div>

                <div className={`flex-1 overflow-y-auto p-4 md:p-6 space-y-6 ${isDark ? "bg-gradient-to-b from-slate-950 to-slate-900" : "bg-gradient-to-b from-gray-50 to-white"}`}>
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                            <div className={`flex max-w-[90%] md:max-w-[80%] lg:max-w-[70%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-2 md:gap-3`}>
                                {/* Avatar */}
                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${msg.type === 'user'
                                    ? "bg-gradient-to-br from-blue-500 to-blue-600"
                                    : "bg-gradient-to-br from-purple-600 to-blue-600"
                                    }`}>
                                    {msg.type === 'user' ? <User size={16} className="text-white md:w-5 md:h-5" /> : <Bot size={16} className="text-white md:w-5 md:h-5" />}
                                </div>

                                {/* Message Content */}
                                <div className="flex flex-col space-y-3 flex-1">
                                    <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl shadow-lg backdrop-blur-sm ${msg.type === 'user'
                                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-sm"
                                        : isDark
                                            ? "bg-slate-800/80 text-slate-100 rounded-tl-sm border border-slate-700/50"
                                            : "bg-white text-gray-800 rounded-tl-sm border border-gray-200"
                                        }`}>
                                        <div className="text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap font-normal">
                                            {msg.content}
                                        </div>
                                    </div>

                                    {/* Videos */}
                                    {msg.videos && msg.videos.length > 0 && (
                                        <div className={`p-4 rounded-2xl shadow-lg backdrop-blur-sm border ${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-gray-200"}`}>
                                            <div className="flex items-center gap-2 mb-4">
                                                <Youtube size={20} className="text-red-500" />
                                                <span className={`text-sm font-bold ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                                                    Recommended Videos
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {msg.videos.map((video) => (
                                                    <a
                                                        key={video.id}
                                                        href={video.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="group block overflow-hidden rounded-xl transition-all hover:scale-[1.02] hover:shadow-xl"
                                                    >
                                                        <div className="relative aspect-video bg-gray-900 overflow-hidden">
                                                            <img
                                                                src={video.thumbnail}
                                                                alt={video.title}
                                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                                                                    <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className={`p-3 text-xs font-medium line-clamp-2 ${isDark ? "bg-slate-900/80 text-slate-300" : "bg-gray-50 text-gray-700"}`}>
                                                            {video.title}
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className={`flex items-center gap-1.5 text-[11px] ${msg.type === 'user' ? 'justify-end' : 'justify-start'} ${isDark ? "text-slate-600" : "text-gray-400"}`}>
                                        <Clock size={10} />
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start animate-fadeIn">
                            <div className="flex gap-3 max-w-[75%]">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
                                    <Bot size={20} className="text-white" />
                                </div>
                                <div className={`p-4 rounded-2xl rounded-tl-sm shadow-lg backdrop-blur-sm border ${isDark ? "bg-slate-800/80 border-slate-700/50" : "bg-white border-gray-200"}`}>
                                    <div className="flex items-center gap-3">
                                        <Loader2 className="animate-spin text-purple-500" size={20} />
                                        <span className={`text-sm ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                                            Analyzing your question...
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className={`p-4 md:p-6 border-t backdrop-blur-sm ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white/50 border-gray-200"}`}>
                    <div className="relative">
                        <div className={`relative flex items-center rounded-xl md:rounded-2xl shadow-xl overflow-hidden border-2 transition-all ${input.trim() ? (isDark ? "border-purple-500" : "border-purple-400") : (isDark ? "border-slate-700" : "border-gray-300")}`}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your doubt here..."
                                disabled={loading}
                                className={`w-full py-3 md:py-4 px-4 md:px-6 bg-transparent focus:outline-none text-sm md:text-[15px] ${isDark ? "text-white placeholder-slate-500" : "text-gray-900 placeholder-gray-400"}`}
                                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                                className={`m-1 md:m-1.5 p-2.5 md:p-3 rounded-lg md:rounded-xl transition-all ${!input.trim() || loading
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 active:scale-95 shadow-lg"
                                    }`}
                            >
                                <Send size={18} className="md:w-5 md:h-5" />
                            </button>
                        </div>
                    </div>
                    <p className={`text-center text-[10px] md:text-[11px] mt-2 md:mt-3 ${isDark ? "text-slate-600" : "text-gray-500"}`}>
                        AI can make mistakes. Please verify important information.
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }

                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                ::-webkit-scrollbar {
                    width: 6px;
                }

                ::-webkit-scrollbar-track {
                    background: transparent;
                }

                ::-webkit-scrollbar-thumb {
                    background: ${isDark ? '#475569' : '#cbd5e1'};
                    border-radius: 3px;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: ${isDark ? '#64748b' : '#94a3b8'};
                }
            `}</style>
        </div>
    );
};

export default StudentAIAssistant;