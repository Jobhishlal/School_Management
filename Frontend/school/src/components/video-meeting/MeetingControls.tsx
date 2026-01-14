import React, { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageCircle, Smile } from 'lucide-react';

interface MeetingControlsProps {
    toggleMute: () => void;
    isMuted: boolean;
    toggleVideo: () => void;
    isVideoOff: boolean;
    endMeeting: () => void;
    isHost: boolean;
    toggleChat: () => void;
    showChat: boolean;
    unreadCount: number;
    isDark: boolean;
    onReaction: (emoji: string) => void;
}

const MeetingControls: React.FC<MeetingControlsProps> = ({
    toggleMute,
    isMuted,
    toggleVideo,
    isVideoOff,
    endMeeting,
    isHost,
    toggleChat,
    showChat,
    unreadCount,
    isDark,
    onReaction
}) => {
    const [showReactions, setShowReactions] = useState(false);
    const reactions = ['👍', '👎', '😂', '😮', '❤️', '🎉'];

    return (
        <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div className={`flex items-center gap-2 p-2 rounded-2xl border shadow-2xl backdrop-blur-xl ${isDark ? 'bg-gray-900/80 border-gray-700/50' : 'bg-white/80 border-gray-200/50'}`}>
                <button
                    onClick={toggleMute}
                    className={`p-4 rounded-xl transition-all duration-200 group relative ${isMuted ? 'bg-red-500 text-white hover:bg-red-600' : (isDark ? 'hover:bg-gray-800 text-gray-200' : 'hover:bg-gray-100 text-gray-700')}`}
                >
                    {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {isMuted ? 'Unmute' : 'Mute'}
                    </span>
                </button>

                <button
                    onClick={toggleVideo}
                    className={`p-4 rounded-xl transition-all duration-200 group relative ${isVideoOff ? 'bg-red-500 text-white hover:bg-red-600' : (isDark ? 'hover:bg-gray-800 text-gray-200' : 'hover:bg-gray-100 text-gray-700')}`}
                >
                    {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
                    </span>
                </button>

                {/* Reaction Picker */}
                <div className="relative">
                    <button
                        onClick={() => setShowReactions(!showReactions)}
                        className={`p-4 rounded-xl transition-all duration-200 group relative ${showReactions ? 'bg-amber-400 text-black' : (isDark ? 'hover:bg-gray-800 text-gray-200' : 'hover:bg-gray-100 text-gray-700')}`}
                    >
                        <Smile size={20} />
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Reactions
                        </span>
                    </button>

                    {/* Popup Menu */}
                    <div className={`absolute bottom-full mb-4 left-1/2 -translate-x-1/2 p-2 rounded-xl flex gap-1 shadow-xl transition-all duration-200 origin-bottom ${showReactions ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'} ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
                        {reactions.map(emoji => (
                            <button
                                key={emoji}
                                onClick={() => {
                                    onReaction(emoji);
                                    setShowReactions(false);
                                }}
                                className="text-2xl hover:scale-125 transition-transform p-1"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={toggleChat}
                    className={`p-4 rounded-xl transition-all duration-200 group relative ${showChat ? 'bg-blue-600 text-white' : (isDark ? 'hover:bg-gray-800 text-gray-200' : 'hover:bg-gray-100 text-gray-700')}`}
                >
                    <div className="relative">
                        <MessageCircle size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold animate-bounce">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Chat
                    </span>
                </button>

                <div className={`w-px h-8 mx-1 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />

                <button
                    onClick={endMeeting}
                    className={`px-6 py-4 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg active:scale-95 ml-1 ${isHost ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20' : 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'}`}
                >
                    <PhoneOff size={20} />
                    <span className="hidden sm:inline">{isHost ? 'End Meeting' : 'Leave'}</span>
                </button>
            </div>
        </footer>
    );
};

export default MeetingControls;
