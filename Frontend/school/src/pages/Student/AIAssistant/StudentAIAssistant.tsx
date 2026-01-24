import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Youtube, Loader2 } from 'lucide-react';
import { useTheme } from '../../../components/layout/ThemeContext';
import { askAIDoubt } from '../../../services/studentAIService';
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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
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
            const response = await askAIDoubt(userMessage.content);

            if (response.success) {
                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    type: 'ai',
                    content: response.data.answer,
                    videos: response.data.videos,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, aiMessage]);
            } else {
                toast.error("Failed to get response");
            }
        } catch (error) {
            console.error("AI Error:", error);
            toast.error("Something went wrong. Please try again.");
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                content: "I apologize, but I encountered an error while processing your request. Please try again later.",
                timestamp: new Date()
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`flex flex-col h-[calc(100vh-100px)] max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-xl border ${isDark ? "bg-[#121A21] border-slate-700" : "bg-white border-gray-200"}`}>

            {/* Header */}
            <div className={`p-4 border-b flex items-center space-x-3 ${isDark ? "bg-slate-800 border-slate-700" : "bg-blue-600"}`}>
                <div className="p-2 bg-white/10 rounded-full">
                    <Bot className="text-white" size={24} />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white">AI Study Assistant</h1>
                    <p className="text-xs text-blue-100">Powered by Gemini & YouTube</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-6 ${isDark ? "bg-[#0d1216]" : "bg-slate-50"}`}>
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[85%] sm:max-w-[75%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>

                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.type === 'user'
                                    ? "bg-blue-600 text-white"
                                    : "bg-purple-600 text-white"
                                }`}>
                                {msg.type === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>

                            {/* Message Bubble */}
                            <div className={`flex flex-col space-y-2`}>
                                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.type === 'user'
                                        ? "bg-blue-600 text-white rounded-tr-none"
                                        : `${isDark ? "bg-slate-800 text-slate-100" : "bg-white text-gray-800"} rounded-tl-none border ${isDark ? "border-slate-700" : "border-gray-100"}`
                                    }`}>
                                    <div className="whitespace-pre-wrap markdown-body">{msg.content}</div>
                                </div>

                                {/* Video Recommendations */}
                                {msg.videos && msg.videos.length > 0 && (
                                    <div className={`mt-3 p-3 rounded-xl border ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-100"}`}>
                                        <div className="flex items-center gap-2 mb-3 text-red-500">
                                            <Youtube size={18} />
                                            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-500"}`}>Recommended Videos</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {msg.videos.map((video) => (
                                                <a
                                                    key={video.id}
                                                    href={video.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`group block overflow-hidden rounded-lg transition-all hover:ring-2 hover:ring-red-500 focus:outline-none`}
                                                >
                                                    <div className="relative aspect-video bg-gray-900">
                                                        <img
                                                            src={video.thumbnail}
                                                            alt={video.title}
                                                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                                                            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-110 transition-transform">
                                                                <div className="w-0 h-0 border-t-6 border-t-transparent border-l-10 border-l-white border-b-6 border-b-transparent ml-1"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`p-2 text-xs font-medium truncate ${isDark ? "bg-slate-900 text-slate-300" : "bg-gray-100 text-gray-700"}`}>
                                                        {video.title}
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <span className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"} px-1`}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="flex max-w-[75%] gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center mt-1">
                                <Bot size={16} />
                            </div>
                            <div className={`p-4 rounded-2xl rounded-tl-none ${isDark ? "bg-slate-800" : "bg-white"} border ${isDark ? "border-slate-700" : "border-gray-100"}`}>
                                <div className="flex items-center gap-2">
                                    <Loader2 className="animate-spin text-purple-500" size={18} />
                                    <span className={`text-sm ${isDark ? "text-slate-300" : "text-gray-500"}`}>Analyzing your question...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className={`p-4 border-t ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
                <form onSubmit={handleSend} className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your doubt here..."
                        disabled={loading}
                        className={`w-full py-3.5 pl-5 pr-14 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${isDark
                                ? "bg-slate-900 border-slate-600 text-white placeholder-slate-500 focus:bg-slate-800"
                                : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:bg-white"
                            }`}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className={`absolute right-2 p-2 rounded-lg transition-all ${!input.trim() || loading
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-purple-600 text-white hover:bg-purple-700 hover:scale-105 shadow-md"
                            }`}
                    >
                        <Send size={20} />
                    </button>
                </form>
                <div className="text-center mt-2">
                    <p className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                        AI can make mistakes. Please verify important information.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StudentAIAssistant;
