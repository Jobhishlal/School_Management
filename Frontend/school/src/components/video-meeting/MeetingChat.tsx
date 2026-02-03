import React from 'react';
import { X, Send } from 'lucide-react';

interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    message: string;
    timestamp: string;
    isSelf: boolean;
}

interface MeetingChatProps {
    showChat: boolean;
    toggleChat: () => void;
    messages: ChatMessage[];
    newMessage: string;
    setNewMessage: (msg: string) => void;
    sendMessage: (e?: React.FormEvent) => void;
    isDark: boolean;
}

const MeetingChat: React.FC<MeetingChatProps> = ({
    showChat,
    toggleChat,
    messages,
    newMessage,
    setNewMessage,
    sendMessage
}) => {
    const formatMessageWithLinks = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
        const parts = text.split(urlRegex);

        return parts.map((part, index) => {
            if (part.match(urlRegex)) {
                const href = part.startsWith('http') ? part : `https://${part}`;
                return (
                    <a
                        key={index}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 break-all"
                    >
                        {part}
                    </a>
                );
            }
            return part;
        });
    };

    return (
        <div className={`fixed inset-y-0 right-0 z-[60] w-80 bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${showChat ? 'translate-x-0' : 'translate-x-full'} border-l border-gray-200 dark:border-gray-800 flex flex-col`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
                <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500">In-Call Messages</h3>
                <button onClick={toggleChat} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                    <X size={18} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-gray-600 dark:text-gray-400 max-w-[150px] truncate">
                                {msg.isSelf ? 'You' : msg.senderName}
                            </span>
                            <span className="text-[10px] text-gray-400">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <div className={`px-4 py-2 rounded-2xl text-sm max-w-[85%] break-words ${msg.isSelf
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'
                            }`}>
                            {formatMessageWithLinks(msg.message)}
                        </div>
                    </div>
                ))}
                <div ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })} />
            </div>

            <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
                <div className="relative">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full pl-4 pr-10 py-2.5 rounded-full text-sm bg-white dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="absolute right-1.5 top-1.5 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Send size={14} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MeetingChat;
