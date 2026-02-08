import React, { useRef, useState, useEffect } from 'react';
import SimplePeer from 'simple-peer';
import { Mic } from 'lucide-react';
import { useAudioLevel } from '../../hooks/useAudioLevel';


interface VideoCardProps {
    peer: SimplePeer.Instance;
    userId?: string;
    role?: string;
    userData?: {
        name: string;
        image?: string;
    };
    isDark: boolean;
    reaction?: string;
    onActivity?: (userId: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ peer, userId, role, userData, isDark, reaction, onActivity }) => {
    const ref = useRef<HTMLVideoElement>(null);
    const [imgError, setImgError] = useState(false);

    // Use the custom audio level hook
    const [stream, setStream] = useState<MediaStream | null>(null);
    const isSpeaking = useAudioLevel(stream);

    useEffect(() => {
        if (isSpeaking && userId && onActivity) {
            onActivity(userId);
        }
    }, [isSpeaking, userId, onActivity]);

    useEffect(() => {
        const handleStream = (remoteStream: MediaStream) => {
            console.log(`VideoCard: Received stream for ${userId}`, {
                id: remoteStream.id,
                videoTracks: remoteStream.getVideoTracks().length,
                audioTracks: remoteStream.getAudioTracks().length
            });

            if (ref.current) {
                ref.current.srcObject = remoteStream;
                // Explicitly call play() to ensure rendering starts
                ref.current.play().catch(err => {
                    console.error("VideoCard: Playback error:", err);
                });
            }
            setStream(remoteStream);
        };

        // Initialize with existing stream if available
        const remoteStreams = (peer as any)._remoteStreams;
        if (remoteStreams && remoteStreams.length > 0) {
            handleStream(remoteStreams[0]);
        }

        peer.on("stream", handleStream);

        return () => {
            peer.off("stream", handleStream);
        }
    }, [peer, userId]);

    useEffect(() => { setImgError(false); }, [userData?.image]);

    return (
        <div className={`relative w-full h-full rounded-2xl overflow-hidden shadow-lg ring-1 transition-all duration-300 group ${isSpeaking ? 'ring-4 ring-green-500 shadow-green-500/50' : 'ring-black/5 dark:ring-white/5'} bg-black`}>
            <video ref={ref} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]" />

            {/* Speaking Indicator - Pulse Background */}
            {isSpeaking && <div className="absolute inset-0 border-4 border-green-500/50 rounded-2xl pointer-events-none animate-pulse" />}

            {/* Overlay Gradient */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

            {/* Mic Indicator */}
            {isSpeaking && (
                <div className="absolute top-4 right-4 p-2 bg-green-500 rounded-full animate-bounce shadow-lg shadow-green-500/40 z-10">
                    <Mic size={14} className="text-white" />
                </div>
            )}

            {/* Reaction Overlay */}
            {reaction && (
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none animate-bounce">
                    <span className="text-4xl md:text-6xl drop-shadow-2xl filter animate-ping absolute opacity-50">{reaction}</span>
                    <span className="text-4xl md:text-6xl drop-shadow-2xl relative">{reaction}</span>
                </div>
            )}

            {/* Name Tag */}
            <div className={`absolute bottom-3 left-3 md:bottom-4 md:left-4 flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1 md:py-1.5 rounded-full backdrop-blur-md border shadow-lg max-w-[90%] md:max-w-[85%] ${isDark ? 'bg-gray-900/60 border-gray-700 text-white' : 'bg-white/60 border-white/20 text-black'}`}>
                {userData?.image && !imgError ? (
                    <img src={userData.image} alt={userData.name} className="w-5 h-5 md:w-6 md:h-6 rounded-full object-cover border border-white/20" onError={() => setImgError(true)} />
                ) : (
                    <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[8px] md:text-[10px] font-bold text-white shadow-inner shrink-0 ${role === 'admin' ? 'bg-purple-600' : 'bg-blue-600'}`}>
                        {userData?.name?.charAt(0) || '?'}
                    </div>
                )}
                <div className="flex flex-col overflow-hidden">
                    <span className="text-[10px] md:text-xs font-semibold truncate leading-none">{userData?.name || 'Participant'}</span>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
