import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import SimplePeer from 'simple-peer';
import { useTheme } from '../../components/layout/ThemeContext';
import { validateJoinMeeting, Getadminprofilemanagement, GetTeachertimetableList } from '../../services/authapi';
import { StudentProfile } from '../../services/Student/StudentApi';
import { showToast } from '../../utils/toast';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { jwtDecode } from "jwt-decode";


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
    const [isWaiting, setIsWaiting] = useState(false);
    const [waitingMessage, setWaitingMessage] = useState("Waiting for the Host");
    const [waitingList, setWaitingList] = useState<any[]>([]);

    const socketRef = useRef<Socket | null>(null);
    const userVideo = useRef<HTMLVideoElement>(null);
    const peersRef = useRef<PeerData[]>([]);

    // Refs for optimization
    const streamRef = useRef<MediaStream | null>(null);
    const userProfileRef = useRef<{ name: string; image?: string } | null>(null);

    useEffect(() => {
        userProfileRef.current = userProfile;
    }, [userProfile]);

    useEffect(() => {
        let currentRole = userRole;

        // Retrieve the correct token based on user role
        const token = localStorage.getItem('adminAccessToken') ||
            localStorage.getItem('teacherAccessToken') ||
            localStorage.getItem('studentAccessToken') ||
            localStorage.getItem('parentAccessToken') ||
            localStorage.getItem('accessToken');

        if (token && !currentRole) {
            try {
                const decoded: any = jwtDecode(token);
                setUserId(decoded.id || decoded.sub); // Adjust based on your token structure
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
                    setMeeting(res.data); // Assuming res.data contains meeting details
                    // isAdmin logic removed as state was unused
                } else {
                    console.log("why this show undeinfed", res.message)
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
                    // Admin data might be in res.profile, res.data.profile, res.data, or res
                    const adminData = res.data || res;
                    data = adminData.profile || adminData.data || adminData;
                } else if (roleLower === 'teacher') {
                    // Teacher info now includes teacherProfile from backend update
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
                        // Student
                        name = data.fullName || data.name || 'Student';
                        image = data.photos?.[0] || data.profileImage || null;
                    }

                    setUserProfile({ name, image });
                } else {
                    // Fallback if data is null (API success but no data)
                    setUserProfile({ name: roleLower === 'admin' ? 'Admin' : 'User', image: undefined });
                }

                if (data) {
                    console.log("Fetched User Profile Data:", data);

                }
            } catch (err) {
                console.error("Error fetching user profile:", err);
                // Fallback on error: Try to get name from token if available
                let fallbackName = roleToUse || 'User';
                try {
                    const token = localStorage.getItem('adminAccessToken') || localStorage.getItem('teacherAccessToken') || localStorage.getItem('accessToken');
                    if (token) {
                        const decoded: any = jwtDecode(token);
                        // Common claims for name: name, username, email, sub
                        fallbackName = decoded.name || decoded.username || decoded.email || decoded.sub || roleToUse;
                        console.log("Extracted fallback name from token:", fallbackName);
                    }
                } catch (e) {
                    console.log("Token extraction failed", e);
                }

                // Ensure name is never empty string or null
                if (!fallbackName) fallbackName = 'Unknown User';

                setUserProfile({ name: fallbackName, image: undefined });
            } finally {
                setProfileLoaded(true);
            }
        };

        checkPermission();
        fetchUserProfile(currentRole); // Pass the role directly
    }, [meetingLink]); // Only re-run if meetingLink changes (or mount)

    useEffect(() => {
        if (!meeting || error || !profileLoaded) return;


        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(currentStream => {
                setStream(currentStream);
                streamRef.current = currentStream;
                if (userVideo.current) {
                    userVideo.current.srcObject = currentStream;
                }


                socketRef.current = io("http://localhost:5000", { withCredentials: true });

                const roomId = meeting.link; // Ensure this is the unique identifier

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
                    setIsWaiting(true);
                    setWaitingMessage("Waiting for the Host to Start the Meeting");
                });

                socketRef.current.on('waiting-for-approval', () => {
                    console.log("Host present. Waiting for approval...");
                    setIsWaiting(true);
                    setWaitingMessage("Waiting for Host to let you in...");
                });

                socketRef.current.on('admission-granted', () => {
                    console.log("Admission Granted!");
                    setIsWaiting(false);
                    // The socket is already moved to the room on backend. 
                    // We just need to ensure UI updates. 
                    // The user-connected events will start flowing now.
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
                    // showToast(`${user.userData?.name || 'Someone'} is waiting in the lobby`, 'info');
                });

                socketRef.current.on('host-joined', () => {
                    // If I was waiting for host, now I wait for approval (unless admitted usually)
                    // But backend logic says: if host joins, waiters get 'waiting-for-approval' emitted 
                    // via broadcast to 'waiting-room'
                });

                socketRef.current.on('user-connected', ({ userId: newUserId, socketId, role, userData }) => {
                    console.log('User connected:', newUserId, userData);

                    // Ignore self-connection (ghost from another tab/session)
                    if (newUserId === userId) return;

                    // Deduplication: Remove existing peer with the same userId (e.g., stale connection)
                    // Note: We access peersRef.current to get the latest state
                    const existingPeerIndex = peersRef.current.findIndex(p => p.userId === newUserId);
                    if (existingPeerIndex !== -1) {
                        console.warn("Replacing existing peer for user:", newUserId);
                        peersRef.current[existingPeerIndex].peer.destroy();
                        peersRef.current.splice(existingPeerIndex, 1);

                        // Update state to remove old peer immediately (optional, but good for UI consistency)
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
                        // Incoming call (likely from Admin if I am Viewer)
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
            stream: stream, // Always send my stream (whether mute/video off is handled by track enabled/disabled)
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
            // Use Ref to ensure we send the LATEST profile data, avoiding stale closures
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
        if (r === 'admin' || r === 'super_admin') {
            navigate('/create-meeting');
        } else if (r === 'teacher') {
            navigate('/teacher/dashboard');
        } else {
            navigate('/student-dashboard'); // Default for students/parents
        }
    };

    const endMeeting = () => {
        const isHost = userId === meeting?.createdBy;
        if (isHost && socketRef.current) {
            if (window.confirm("Are you sure you want to end the meeting for everyone?")) {
                socketRef.current.emit('end-meeting', { meetingId: meeting?.link });
            } else {
                return; // Cancelled
            }
        }

        // For guests (or host confirming end), cleanup and leave
        showToast('You have left the meeting', 'info');
        cleanup();
        handleAuthRedirect(userRole);
    }

    if (loading) return <div className="flex justify-center items-center h-screen">Loading Meeting...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

    const admitUser = (socketId: string) => {
        if (!meeting) return;
        socketRef.current?.emit('admit-user', { meetingId: meeting.link, socketId });
        setWaitingList(prev => prev.filter(u => u.socketId !== socketId));
    };

    const isHost = userId === meeting?.createdBy;

    return (
        <div className={`h-screen flex flex-col font-sans selection:bg-blue-500/20 ${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Header */}
            <header className={`px-6 py-4 flex items-center justify-between border-b backdrop-blur-md sticky top-0 z-50 ${isDark ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'}`}>
                <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm border border-gray-100'}`}>
                        <Video size={20} className="text-blue-500" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight tracking-tight">{meeting?.title || 'Video Meeting'}</h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className={`w-2 h-2 rounded-full ${peers.length > 0 ? 'bg-green-500' : 'bg-amber-500'}`} />
                            <p className="text-xs opacity-60 font-medium tracking-wide">{meeting?.type?.toUpperCase()} • {peers.length + 1} {peers.length + 1 === 1 ? 'Participant' : 'Participants'}</p>
                        </div>
                    </div>
                </div>

                {waitingList.length > 0 && (
                    <div className="relative group">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                            <span>Lobby</span>
                            <span className="bg-white text-blue-600 px-1.5 py-0.5 rounded-full text-xs font-bold leading-none min-w-[20px] text-center">{waitingList.length}</span>
                        </button>

                        {/* Dropdown for Waiting List */}
                        <div className={`absolute top-full right-0 mt-2 w-80 rounded-2xl shadow-2xl border p-3 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all transform origin-top-right scale-95 group-hover:scale-100 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                            <div className="flex justify-between items-center mb-3 px-1">
                                <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wider">Waiting Room</h3>
                                <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-gray-500 font-medium">{waitingList.length} pending</span>
                            </div>
                            <div className="space-y-1 max-h-[300px] overflow-y-auto">
                                {waitingList.map((user) => (
                                    <div key={user.socketId} className={`flex items-center justify-between p-2.5 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800' : 'bg-gray-50 border-gray-100 hover:bg-white hover:shadow-md'} transition-all`}>
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0 border border-orange-200">
                                                {user.userData?.name?.charAt(0) || '?'}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold truncate leading-tight">{user.userData?.name || 'Guest'}</p>
                                                <p className="text-[10px] text-gray-500 capitalize">{user.role}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => admitUser(user.socketId)}
                                            className="text-xs bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:opacity-90 px-3 py-1.5 rounded-lg font-semibold transition-opacity"
                                        >
                                            Admit
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Stage Grid */}
            <main className="flex-1 overflow-hidden p-4 md:p-6 flex items-center justify-center">
                <div className={`grid gap-4 w-full max-w-[1920px] mx-auto transition-all duration-500 ease-in-out ${(peers.length + 1) <= 1 ? 'h-full grid-cols-1' :
                    (peers.length + 1) === 2 ? 'h-[60vh] md:h-full grid-cols-1 md:grid-cols-2 auto-rows-fr' :
                        (peers.length + 1) <= 4 ? 'h-full grid-cols-2 auto-rows-fr' :
                            (peers.length + 1) <= 6 ? 'h-full grid-cols-2 lg:grid-cols-3 auto-rows-fr' :
                                (peers.length + 1) <= 9 ? 'h-full grid-cols-3 auto-rows-fr' :
                                    'h-full grid-cols-3 lg:grid-cols-4 auto-rows-min'
                    }`}>
                    {/* My Video Card */}
                    <div className="relative w-full h-full min-h-[200px] rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5 dark:ring-white/5 group bg-black">
                        <video ref={userVideo} muted autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]" /> {/* Mirror local video */}

                        {/* Overlay Gradient */}
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

                        {/* Status Badge */}
                        <div className={`absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border shadow-lg ${isDark ? 'bg-gray-900/60 border-gray-700 text-white' : 'bg-white/60 border-white/20 text-black'}`}>
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-xs font-semibold tracking-wide">You ({isHost ? 'Host' : 'Guest'})</span>
                            {isMuted && <div className="pl-2 border-l border-current/20"><MicOff size={10} className="text-red-500" /></div>}
                        </div>
                    </div>

                    {/* Peer Video Cards */}
                    {peers.map((peerData) => (
                        <div key={peerData.peerId} className="w-full h-full min-h-[200px]">
                            <VideoCard
                                peer={peerData.peer}
                                userId={peerData.userId}
                                role={peerData.role}
                                userData={peerData.userData}
                                isDark={isDark}
                            />
                        </div>
                    ))}
                </div>
            </main>

            {/* Floating Control Bar */}
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
        </div>
    );
};

const VideoCard: React.FC<{ peer: SimplePeer.Instance; userId?: string; role?: string; userData?: { name: string; image?: string }, isDark?: boolean }> = ({ peer, userId, role, userData, isDark }) => {
    const ref = useRef<HTMLVideoElement>(null);
    const [imgError, setImgError] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    useEffect(() => {
        const handleStream = (stream: MediaStream) => {
            if (ref.current) ref.current.srcObject = stream;

            try {
                // Initialize AudioContext only once user interaction policies allow (usually fine in effect for established stream)
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                if (!audioContextRef.current) {
                    audioContextRef.current = new AudioContextClass();
                }

                if (audioContextRef.current.state === 'suspended') {
                    audioContextRef.current.resume();
                }

                if (stream.getAudioTracks().length > 0) {
                    if (sourceRef.current) {
                        try { sourceRef.current.disconnect(); } catch (e) { /**/ }
                    }

                    analyserRef.current = audioContextRef.current.createAnalyser();
                    analyserRef.current.fftSize = 256; // Smaller FFT is enough for volume
                    sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
                    sourceRef.current.connect(analyserRef.current);

                    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
                    const checkAudio = () => {
                        if (!analyserRef.current) return;
                        analyserRef.current.getByteFrequencyData(dataArray);
                        const volume = dataArray.reduce((src, a) => src + a, 0) / dataArray.length;
                        setIsSpeaking(volume > 15); // Threshold
                        requestAnimationFrame(checkAudio);
                    };
                    checkAudio();
                }
            } catch (e) {
                console.error("Audio setup error", e);
            }
        };

        if ((peer as any)._remoteStreams && (peer as any)._remoteStreams.length > 0) {
            handleStream((peer as any)._remoteStreams[0]);
        }
        peer.on("stream", handleStream);

        return () => {
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close().catch(() => { });
            }
        }
    }, [peer]);

    useEffect(() => { setImgError(false); }, [userData?.image]);

    return (
        <div className={`relative w-full h-full rounded-2xl overflow-hidden shadow-lg ring-1 transition-all duration-300 group ${isSpeaking ? 'ring-2 ring-green-500' : 'ring-black/5 dark:ring-white/5'} bg-black`}>
            <video ref={ref} autoPlay playsInline className="w-full h-full object-cover" />

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

            {/* Name Tag */}
            <div className={`absolute bottom-4 left-4 flex items-center gap-3 px-3 py-1.5 rounded-full backdrop-blur-md border shadow-lg max-w-[85%] ${isDark ? 'bg-gray-900/60 border-gray-700 text-white' : 'bg-white/60 border-white/20 text-black'}`}>
                {userData?.image && !imgError ? (
                    <img src={userData.image} alt={userData.name} className="w-6 h-6 rounded-full object-cover border border-white/20" onError={() => setImgError(true)} />
                ) : (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-inner shrink-0 ${role === 'admin' ? 'bg-purple-600' : 'bg-blue-600'}`}>
                        {userData?.name?.charAt(0) || '?'}
                    </div>
                )}
                <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-semibold truncate leading-none">{userData?.name || 'Participant'}</span>
                </div>
            </div>
        </div>
    );
};

export default VideoMeeting;
