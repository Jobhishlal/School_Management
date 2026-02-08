import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import SimplePeer from 'simple-peer';
import { useTheme } from '../../components/layout/ThemeContext';
import { validateJoinMeeting, Getadminprofilemanagement, GetTeachertimetableList } from '../../services/authapi';
import { StudentProfile } from '../../services/Student/StudentApi';
import { showToast } from '../../utils/toast';
import { MicOff, Mic } from 'lucide-react';
import { jwtDecode } from "jwt-decode";
import MeetingHeader from '../../components/video-meeting/MeetingHeader';
import MeetingControls from '../../components/video-meeting/MeetingControls';
import MeetingChat from '../../components/video-meeting/MeetingChat';
import VideoCard from '../../components/video-meeting/VideoCard';
import { useAudioLevel } from '../../hooks/useAudioLevel';
import { Modal } from '../../components/common/Modal';


interface MeetingDetails {
    _id: string;
    title: string;
    description: string;
    link: string;
    type: string;
    status: string;
    createdBy: string;
}

interface PeerData {
    peerId: string;
    peer: SimplePeer.Instance;
    role?: string;
    userId?: string;
    userData?: {
        name: string;
        image?: string;
    }
}

interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    message: string;
    timestamp: string;
    isSelf: boolean;
}

const VideoMeeting: React.FC = () => {
    const { meetingLink } = useParams<{ meetingLink: string }>();
    const navigate = useNavigate();
    const { isDark } = useTheme();

    const [meeting, setMeeting] = useState<MeetingDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [peers, setPeers] = useState<PeerData[]>([]);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    // User Info
    const [userId, setUserId] = useState<string>('');
    const [userRole, setUserRole] = useState<string>('');

    // Profile Data
    const [userProfile, setUserProfile] = useState<{ name: string; image?: string } | null>(null);
    const [profileLoaded, setProfileLoaded] = useState(false);

    const [waitingList, setWaitingList] = useState<any[]>([]);

    // Chat State
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [unreadCount, setUnreadCount] = useState(0);

    // Reactions State
    const [reactions, setReactions] = useState<{ [userId: string]: string }>({});
    const reactionTimeouts = useRef<{ [userId: string]: NodeJS.Timeout }>({});

    const [showEndMeetingModal, setShowEndMeetingModal] = useState(false);

    // Grid State
    const [pinnedUserId, setPinnedUserId] = useState<string | null>(null);
    const [lastSpokeAt, setLastSpokeAt] = useState<{ [userId: string]: number }>({});


    const socketRef = useRef<Socket | null>(null);
    const userVideo = useRef<HTMLVideoElement>(null);
    const peersRef = useRef<PeerData[]>([]);


    const streamRef = useRef<MediaStream | null>(null);
    const userProfileRef = useRef<{ name: string; image?: string } | null>(null);

    const showChatRef = useRef(showChat);
    const messageIdsRef = useRef(new Set<string>());

    // Audio Level Hook (Must be called unconditionally)
    const isSpeakingSelf = useAudioLevel(stream);

    useEffect(() => {
        showChatRef.current = showChat;
    }, [showChat]);

    useEffect(() => {
        userProfileRef.current = userProfile;
    }, [userProfile]);

    useEffect(() => {
        let currentRole = userRole;


        const token = localStorage.getItem('adminAccessToken') ||
            localStorage.getItem('teacherAccessToken') ||
            localStorage.getItem('studentAccessToken') ||
            localStorage.getItem('parentAccessToken') ||
            localStorage.getItem('accessToken');

        if (token && !currentRole) {
            try {
                const decoded: any = jwtDecode(token);
                setUserId(decoded.id || decoded.sub);
                currentRole = decoded.role;
                setUserRole(currentRole);
            } catch (e) {
                console.error("Invalid token", e);
            }
        }

        const checkPermission = async () => {
            if (!meetingLink) return;
            try {
                const res = await validateJoinMeeting(meetingLink!);
                console.log("Result", res)
                if (res.success) {
                    setMeeting(res.data);

                } else {

                    setError(res.message || 'Unauthorized');
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to join meeting');
            } finally {
                setLoading(false);
            }
        };

        const fetchUserProfile = async (roleToUse: string) => {
            if (!roleToUse) {
                setProfileLoaded(true);
                return;
            }

            try {
                let data;
                const roleLower = roleToUse.toLowerCase();
                if (roleLower === 'student') {
                    const res = await StudentProfile();
                    data = res.data?.data;
                } else if (roleLower === 'admin' || roleLower === 'sub_admin') {
                    const res = await Getadminprofilemanagement();

                    const adminData = res.data || res;
                    data = adminData.profile || adminData.data || adminData;
                } else if (roleLower === 'teacher') {

                    const res = await GetTeachertimetableList();
                    data = res;
                }

                if (data) {
                    console.log("Fetched User Profile Data:", data);
                    let name = 'User';
                    let image = null;

                    if (roleLower === 'teacher') {
                        name = data.teacherProfile?.name || data.name || 'Teacher';
                        image = data.teacherProfile?.image || null;
                    } else if (roleLower === 'admin' || roleLower === 'sub_admin') {
                        name = data.name || data.username || (roleLower.includes('admin') ? 'Admin' : 'User');
                        image = data.photo?.[0]?.url || data.image || null;
                    } else {

                        name = data.fullName || data.name || 'Student';
                        image = data.photos?.[0] || data.profileImage || null;
                    }

                    setUserProfile({ name, image });
                } else {

                    setUserProfile({ name: roleLower === 'admin' ? 'Admin' : 'User', image: undefined });
                }

                if (data) {
                    console.log("Fetched User Profile Data:", data);

                }
            } catch (err) {
                console.error("Error fetching user profile:", err);

                let fallbackName = roleToUse || 'User';
                try {
                    const token = localStorage.getItem('adminAccessToken') || localStorage.getItem('teacherAccessToken') || localStorage.getItem('accessToken');
                    if (token) {
                        const decoded: any = jwtDecode(token);

                        fallbackName = decoded.name || decoded.username || decoded.email || decoded.sub || roleToUse;
                        console.log("Extracted fallback name from token:", fallbackName);
                    }
                } catch (e) {
                    console.log("Token extraction failed", e);
                }


                if (!fallbackName) fallbackName = 'Unknown User';

                setUserProfile({ name: fallbackName, image: undefined });
            } finally {
                setProfileLoaded(true);
            }
        };

        checkPermission();
        fetchUserProfile(currentRole);
    }, [meetingLink]);

    useEffect(() => {
        if (!meeting || error || !profileLoaded) return;


        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(currentStream => {
                setStream(currentStream);
                streamRef.current = currentStream;
                if (userVideo.current) {
                    userVideo.current.srcObject = currentStream;
                }



                const socketUrl = import.meta.env.VITE_SERVER_URL?.startsWith('/')
                    ? window.location.origin
                    : (import.meta.env.VITE_SERVER_URL || 'http://localhost:5000');

                console.log("VideoMeeting: Initializing socket with URL:", socketUrl);

                socketRef.current = io(socketUrl, {
                    withCredentials: true,
                    transports: ["websocket"],
                    path: '/socket.io'
                });



                const roomId = meeting.link;

                console.log("EMIT join-meeting with userData:", userProfile);

                const safeUserData = userProfile || { name: userRole || 'Participant', image: undefined };
                console.log("EMIT join-meeting with userData:", safeUserData);

                socketRef.current.emit('join-meeting', {
                    meetingId: roomId,
                    userId,
                    role: userRole,
                    userData: safeUserData,
                    meetingCreatorId: meeting?.createdBy
                });

                socketRef.current.on('waiting-for-host', () => {
                    console.log("Host not present. Waiting...");

                });

                socketRef.current.on('waiting-for-approval', () => {
                    console.log("Host present. Waiting for approval...");

                });

                socketRef.current.on('admission-granted', () => {
                    console.log("Admission Granted!");


                });

                socketRef.current.on('waiting-list-update', (waiters: any[]) => {
                    console.log("Waiting list updated:", waiters);
                    setWaitingList(waiters);
                });

                socketRef.current.on('user-joined-waiting', (user: any) => {
                    setWaitingList(prev => {
                        if (prev.find(u => u.socketId === user.socketId)) return prev;
                        return [...prev, user];
                    });

                });

                socketRef.current.on('host-joined', () => {

                });

                socketRef.current.on('user-connected', ({ userId: newUserId, socketId, role, userData }) => {
                    console.log('User connected:', newUserId, userData);
                    if (newUserId !== userId) {
                        showToast(`${userData?.name || 'A user'} joined the meeting`, 'success', 3000, `join-${newUserId}`);
                    }

                    if (newUserId === userId) return;


                    const existingPeerIndex = peersRef.current.findIndex(p => p.userId === newUserId);
                    if (existingPeerIndex !== -1) {
                        console.warn("Replacing existing peer for user:", newUserId);
                        peersRef.current[existingPeerIndex].peer.destroy();
                        peersRef.current.splice(existingPeerIndex, 1);


                        setPeers(prev => prev.filter(p => p.userId !== newUserId));
                    }

                    const peer = createPeer(socketId, currentStream);
                    peersRef.current.push({
                        peerId: socketId,
                        peer,
                        role,
                        userId: newUserId,
                        userData
                    });
                    setPeers((users) => [...users, { peerId: socketId, peer, role, userId: newUserId, userData }]);
                });

                socketRef.current.on('signal', ({ from, signal, userPayload }) => {
                    const item = peersRef.current.find(p => p.peerId === from);
                    if (item) {
                        item.peer.signal(signal);
                    } else {

                        const peer = addPeer(signal, from, currentStream);
                        peersRef.current.push({
                            peerId: from,
                            peer,
                            role: userPayload?.role,
                            userId: userPayload?.userId,
                            userData: userPayload?.userData
                        });
                        setPeers((users) => [...users, { peerId: from, peer, role: userPayload?.role, userId: userPayload?.userId, userData: userPayload?.userData }]);
                    }
                });

                socketRef.current.on("connect_error", (err) => {
                    console.error("Socket Connect Error", err);
                });

                socketRef.current.on('user-disconnected', (peerId) => {
                    console.log("User disconnected (remove peer):", peerId);
                    const peerObj = peersRef.current.find(p => p.peerId === peerId);
                    if (peerObj) {
                        peerObj.peer.destroy();
                    }
                    const peers = peersRef.current.filter(p => p.peerId !== peerId);
                    peersRef.current = peers;
                    setPeers(peers);
                });

                socketRef.current.on('chat-message', (data: any) => {

                    if (data.id && messageIdsRef.current.has(data.id)) {
                        console.warn("Duplicate message blocked by Ref check:", data.id);
                        return;
                    }

                    if (data.id) {
                        messageIdsRef.current.add(data.id);
                    }

                    console.log("Processing new message:", data.id);

                    setMessages(prev => {

                        if (prev.some(msg => msg.id === data.id)) return prev;

                        return [...prev, {
                            id: data.id || `fallback-${Date.now()}-${Math.random()}`,
                            senderId: data.senderId,
                            senderName: data.senderName,
                            message: data.message,
                            timestamp: data.timestamp,
                            isSelf: data.senderId === userId
                        }];
                    });

                    // Use ref to check if chat is open to avoid stale closure
                    if (!showChatRef.current) {
                        setUnreadCount(prev => prev + 1);
                    }
                });

                socketRef.current.on('reaction-received', (data: { userId: string, emoji: string }) => {
                    setReactions(prev => ({ ...prev, [data.userId]: data.emoji }));

                    // Clear existing timeout for this user
                    if (reactionTimeouts.current[data.userId]) {
                        clearTimeout(reactionTimeouts.current[data.userId]);
                    }

                    // Set new timeout to remove emoji
                    reactionTimeouts.current[data.userId] = setTimeout(() => {
                        setReactions(prev => {
                            const newReactions = { ...prev };
                            delete newReactions[data.userId];
                            return newReactions;
                        });
                        delete reactionTimeouts.current[data.userId];
                    }, 3000);
                });

                socketRef.current.on('meeting-ended', () => {
                    showToast('Meeting has ended by Host', 'info');
                    cleanup();
                    handleAuthRedirect(userRole);
                });

            })
            .catch((err: any) => {
                console.error("Error accessing media devices:", err);
                if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                    setError('Camera/Microphone is already in use by another application.');
                } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                    setError('Permission to access Camera/Microphone was denied.');
                } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                    setError('No Camera or Microphone found on this device.');
                } else {
                    setError('Could not access camera/microphone: ' + (err.message || 'Unknown error'));
                }
            });

        return () => {
            cleanup();
        };

    }, [meeting, error, profileLoaded, userProfile]);

    const cleanup = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        peersRef.current.forEach(p => p.peer.destroy());
    }

    const createPeer = (userToSignal: string, stream: MediaStream | undefined) => {
        const peer = new SimplePeer({
            initiator: true,
            trickle: false,
            stream: stream,
        });

        peer.on('signal', signal => {
            const latestProfile = userProfileRef.current || { name: userRole || 'Participant', image: undefined };
            console.log("SENDING SIGNAL (Initiator) with profile:", latestProfile);

            socketRef.current?.emit('signal', {
                to: userToSignal,
                signal,
                userPayload: { userId, role: userRole, userData: latestProfile }
            });
        });

        peer.on('connect', () => {
            console.log("Peer (Initiator) CONNECTED to:", userToSignal);
        });

        peer.on('error', (err) => {
            console.error("Peer (Initiator) ERROR with:", userToSignal, err);
        });

        return peer;
    }

    const addPeer = (incomingSignal: any, callerID: string, stream: MediaStream | undefined) => {
        const peer = new SimplePeer({
            initiator: false,
            trickle: false,
            stream: stream,
        });

        peer.on('signal', signal => {

            const latestProfile = userProfileRef.current || { name: userRole || 'Participant', image: undefined };
            console.log("SENDING SIGNAL (Receiver) with profile:", latestProfile);

            socketRef.current?.emit('signal', {
                to: callerID,
                signal,
                userPayload: { userId, role: userRole, userData: latestProfile }
            });
        });

        peer.on('connect', () => {
            console.log("Peer (Receiver) CONNECTED to:", callerID);
        });

        peer.on('error', (err) => {
            console.error("Peer (Receiver) ERROR with:", callerID, err);
        });

        peer.signal(incomingSignal);

        return peer;
    }

    const toggleMute = () => {
        if (streamRef.current) {
            streamRef.current.getAudioTracks()[0].enabled = !streamRef.current.getAudioTracks()[0].enabled;
            setIsMuted(!isMuted);
        }
    }

    const toggleVideo = () => {
        if (streamRef.current) {
            streamRef.current.getVideoTracks()[0].enabled = !streamRef.current.getVideoTracks()[0].enabled;
            setIsVideoOff(!isVideoOff);
        }
    }

    const handleAuthRedirect = (role: string) => {
        const r = role?.toLowerCase();
        if (r === 'admin' || r === 'super_admin' || r === 'sub_admin') {
            navigate('/create-meeting');
        } else if (r === 'teacher') {
            navigate('/teacher/dashboard');
        } else if (r === 'parent') {
            navigate('/parent/dashboard');
        } else {
            navigate('/student/dashboard');
        }
    };

    const endMeeting = () => {
        const isHost = userId === meeting?.createdBy;
        if (isHost) {
            setShowEndMeetingModal(true);
        } else {
            handleLeaveMeeting();
        }
    }

    const handleLeaveMeeting = () => {
        showToast('You have left the meeting', 'info');
        cleanup();
        handleAuthRedirect(userRole);
    };

    const confirmEndMeeting = () => {
        if (socketRef.current) {
            socketRef.current.emit('end-meeting', { meetingId: meeting?.link });
        }
        setShowEndMeetingModal(false);
        handleLeaveMeeting();
    };


    // --- Dynamic Sorting Logic ---
    const handleActivity = (speakerId: string) => {
        setLastSpokeAt(prev => ({
            ...prev,
            [speakerId]: Date.now()
        }));
    };

    // Update self activity
    useEffect(() => {
        if (isSpeakingSelf) {
            handleActivity(userId);
        }
    }, [isSpeakingSelf, userId]);

    const sortedPeers = React.useMemo(() => {
        return [...peers].sort((a, b) => {
            const timeA = lastSpokeAt[a.userId || ''] || 0;
            const timeB = lastSpokeAt[b.userId || ''] || 0;
            return timeB - timeA;
        });
    }, [peers, lastSpokeAt]);

    const visiblePeers = React.useMemo(() => {
        let displayList = [...sortedPeers];

        if (pinnedUserId) {
            const pinnedPeerIndex = displayList.findIndex(p => p.userId === pinnedUserId);
            if (pinnedPeerIndex > -1) {
                const [pinned] = displayList.splice(pinnedPeerIndex, 1);
                displayList.unshift(pinned);
            }
        }

        return displayList;
    }, [sortedPeers, pinnedUserId]);

    const MAX_GRID_ITEMS = 8;
    const peersToShow = visiblePeers.slice(0, MAX_GRID_ITEMS - 1);
    const overflowCount = Math.max(0, visiblePeers.length - (MAX_GRID_ITEMS - 1));
    if (loading) return <div className="flex justify-center items-center h-screen">Loading Meeting...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

    const sendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim() || !socketRef.current) return;

        // Use crypto.randomUUID if available, else fallback to timestamp + random
        const msgId = typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        console.log("Sending chat message:", { msgId, message: newMessage });

        const msgData = {
            id: msgId,
            meetingId: meeting?.link,
            message: newMessage,
            senderId: userId,
            senderName: userProfile?.name || 'User',
            timestamp: new Date().toISOString()
        };

        socketRef.current.emit('chat-message', msgData);
        setNewMessage("");
    };

    const toggleChat = () => {
        setShowChat(!showChat);
        if (!showChat) setUnreadCount(0);
    };

    const admitUser = (socketId: string) => {
        if (!meeting) return;
        socketRef.current?.emit('admit-user', { meetingId: meeting.link, socketId });
        setWaitingList(prev => prev.filter(u => u.socketId !== socketId));
    };

    const sendReaction = (emoji: string) => {
        if (!socketRef.current || !meeting) return;


        setReactions(prev => ({ ...prev, [userId]: emoji }));
        if (reactionTimeouts.current[userId]) clearTimeout(reactionTimeouts.current[userId]);
        reactionTimeouts.current[userId] = setTimeout(() => {
            setReactions(prev => {
                const newReactions = { ...prev };
                delete newReactions[userId];
                return newReactions;
            });
            delete reactionTimeouts.current[userId];
        }, 3000);

        socketRef.current.emit('send-reaction', {
            meetingId: meeting.link,
            userId,
            emoji
        });
    };

    const isCreator = userId === meeting?.createdBy;
    const normalizedRole = userRole ? String(userRole).toLowerCase() : '';
    const isAdmin = normalizedRole === 'admin' || normalizedRole === 'super_admin' || normalizedRole === 'sub_admin';
    const isHost = isCreator || isAdmin;

    // 🔍 DEBUG LOGGING - Remove after testing
    console.log('=== HOST DETECTION DEBUG ===');
    console.log('User ID:', userId);
    console.log('Meeting Creator ID:', meeting?.createdBy);
    console.log('User Role:', userRole);
    console.log('Normalized Role:', normalizedRole);
    console.log('Is Creator?', isCreator);
    console.log('Is Admin?', isAdmin);
    console.log('✅ IS HOST?', isHost);
    console.log('Waiting List Count:', waitingList.length);
    console.log('Waiting List:', waitingList);
    console.log('===========================');








    return (
        <div className={`min-h-screen flex flex-col font-sans selection:bg-blue-500/20 ${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <MeetingHeader
                meeting={meeting}
                peers={peers}
                waitingList={waitingList}
                admitUser={admitUser}
                isDark={isDark}
            />

            {/* Main Stage Grid */}
            <main className="flex-1 p-4 md:p-6 flex items-center justify-center relative">

                <div className={`grid gap-2 md:gap-3 w-full h-full max-h-[calc(100vh-180px)] mx-auto transition-all duration-500 ease-in-out place-content-center 
                    ${pinnedUserId
                        ? 'grid-cols-1 md:grid-cols-4 grid-rows-6 md:grid-rows-4' // Pinned Layout
                        : (peersToShow.length + 1) <= 1 ? 'grid-cols-1 max-w-2xl' :
                            (peersToShow.length + 1) === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl' :
                                (peersToShow.length + 1) <= 4 ? 'grid-cols-2 max-w-5xl' :
                                    (peersToShow.length + 1) <= 6 ? 'grid-cols-2 lg:grid-cols-3 max-w-6xl' :
                                        (peersToShow.length + 1) <= 9 ? 'grid-cols-3 max-w-7xl' :
                                            'grid-cols-3 lg:grid-cols-4 max-w-[1920px] auto-rows-min'
                    }`}>

                    {/* Self Video Wrapper */}
                    <div className={`relative w-full h-full min-h-[140px] md:min-h-[160px] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 group 
                        ${pinnedUserId === userId ? 'row-span-4 md:col-span-3 md:row-span-4' : 'row-span-1 md:row-span-1'}
                        ${!pinnedUserId && 'hover:scale-[1.02]'}
                        ${isSpeakingSelf ? 'ring-4 ring-green-500 shadow-green-500/50' : 'ring-1 ring-black/5 dark:ring-white/5'} bg-black`}
                        onClick={() => setPinnedUserId(pinnedUserId === userId ? null : userId)}
                    >
                        <video ref={userVideo} muted autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]" />

                        {/* Pin Indicator */}
                        <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70">
                                {/* Pin Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>
                            </button>
                        </div>

                        {/* Speaking Indicator */}
                        {isSpeakingSelf && <div className="absolute inset-0 border-4 border-green-500/50 rounded-2xl pointer-events-none animate-pulse" />}
                        {reactions[userId] && (
                            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none animate-bounce">
                                <span className="text-4xl md:text-6xl drop-shadow-2xl filter animate-ping absolute opacity-50">{reactions[userId]}</span>
                                <span className="text-4xl md:text-6xl drop-shadow-2xl relative">{reactions[userId]}</span>
                            </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 h-16 md:h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                        {isSpeakingSelf && (
                            <div className="absolute top-3 right-3 md:top-4 md:right-4 p-1.5 md:p-2 bg-green-500 rounded-full animate-bounce shadow-lg shadow-green-500/40 z-10">
                                <Mic size={12} className="md:w-3.5 md:h-3.5 text-white" />
                            </div>
                        )}
                        <div className={`absolute bottom-3 left-3 md:bottom-4 md:left-4 flex items-center gap-1.5 md:gap-2 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full backdrop-blur-md border shadow-lg ${isDark ? 'bg-gray-900/60 border-gray-700 text-white' : 'bg-white/60 border-white/20 text-black'}`}>
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500" />
                            <span className="text-[10px] md:text-xs font-semibold tracking-wide truncate max-w-[80px] md:max-w-none">You ({isHost ? 'Host' : 'Guest'})</span>
                            {isMuted && <div className="pl-1.5 border-l border-current/20 ml-0.5"><MicOff size={10} className="text-red-500" /></div>}
                        </div>
                    </div>

                    {/* Peer Video Cards */}
                    {peersToShow.map((peerData) => (
                        <div key={peerData.peerId}
                            className={`w-full h-full min-h-[140px] md:min-h-[160px] cursor-pointer
                                ${pinnedUserId === peerData.userId ? 'row-span-4 md:col-span-3 md:row-span-4 order-first' : 'row-span-1 md:row-span-1'}
                             `}
                            onClick={() => setPinnedUserId(pinnedUserId === peerData.userId ? null : peerData.userId || null)}
                        >
                            <VideoCard
                                peer={peerData.peer}
                                userId={peerData.userId}
                                role={peerData.role}
                                userData={peerData.userData}
                                isDark={isDark}
                                reaction={reactions[peerData.userId || '']}
                                onActivity={handleActivity}
                            />
                        </div>
                    ))}

                    {/* Overflow Indicator */}
                    {overflowCount > 0 && (
                        <div className="w-full h-full min-h-[140px] md:min-h-[160px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                            <div className="text-center p-2">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mx-auto mb-1.5 md:mb-2 text-base md:text-lg font-bold">
                                    +{overflowCount}
                                </div>
                                <span className="text-[10px] md:text-sm text-gray-500 dark:text-gray-400">Other Participants</span>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <MeetingChat
                showChat={showChat}
                toggleChat={toggleChat}
                messages={messages}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                sendMessage={sendMessage}
                isDark={isDark}
            />

            <MeetingControls
                toggleMute={toggleMute}
                isMuted={isMuted}
                toggleVideo={toggleVideo}
                isVideoOff={isVideoOff}
                endMeeting={endMeeting}
                isHost={isHost}
                toggleChat={toggleChat}
                showChat={showChat}
                unreadCount={unreadCount}
                isDark={isDark}
                onReaction={sendReaction}
            />
            {/* End Meeting Confirmation Modal */}
            <Modal
                isOpen={showEndMeetingModal}
                onClose={() => setShowEndMeetingModal(false)}
                title="End Meeting"
            >
                <div className="space-y-4">
                    <p className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Are you sure you want to end the meeting for everyone?
                    </p>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={() => setShowEndMeetingModal(false)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmEndMeeting}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
                        >
                            End Meeting
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default VideoMeeting;

