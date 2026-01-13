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
                    userData: safeUserData
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
                    showToast('Meeting has ended', 'info');
                    cleanup();
                    navigate('/student-dashboard');
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
            // Use Ref to ensure we send the LATEST profile data, avoiding stale closures
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

    const endMeeting = () => {
        if (socketRef.current) {
            socketRef.current.emit('end-meeting', { meetingId: meeting?.link });
        }
        cleanup();
        navigate(-1);
    }

    if (loading) return <div className="flex justify-center items-center h-screen">Loading Meeting...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

    return (
        <div className={`h-screen flex flex-col ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
            {/* Header */}
            <div className="p-4 shadow-md flex justify-between items-center bg-opacity-90 z-10">
                <div>
                    <h1 className="text-xl font-bold">{meeting?.title}</h1>
                    <span className="text-sm opacity-75">{meeting?.type.toUpperCase()} Meeting</span>
                </div>
                <div className="flex gap-2">
                    <button className="bg-red-600 p-2 rounded-full text-white" onClick={endMeeting}>
                        <PhoneOff size={24} />
                    </button>
                </div>
            </div>

            {/* Main Video Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-wrap justify-center gap-4">
                {/* My Video */}
                <div className="relative w-full max-w-3xl aspect-video bg-black rounded-lg overflow-hidden shadow-lg border border-gray-700">
                    <video ref={userVideo} muted autoPlay playsInline className="w-full h-full object-cover" />
                    <div className="absolute bottom-4 left-4 text-white bg-black/50 px-2 py-1 rounded">
                        {userProfile?.name || 'You'} {isMuted && '(Muted)'}
                    </div>
                </div>

                {/* Peers Video */}
                {peers.map((peerData) => (
                    <VideoCard key={peerData.peerId} peer={peerData.peer} userId={peerData.userId} role={peerData.role} userData={peerData.userData} />
                ))}
            </div>

            {/* Controls */}
            <div className="p-4 flex justify-center gap-6 bg-opacity-90 shadow-inner">
                <button onClick={toggleMute} className={`p-4 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-700 text-white'}`}>
                    {isMuted ? <MicOff /> : <Mic />}
                </button>
                <button onClick={toggleVideo} className={`p-4 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-gray-700 text-white'}`}>
                    {isVideoOff ? <VideoOff /> : <Video />}
                </button>
                {/* Chat or Participant list toggles can go here */}
            </div>
        </div>
    );
};

const VideoCard: React.FC<{ peer: SimplePeer.Instance; userId?: string; role?: string; userData?: { name: string; image?: string } }> = ({ peer, userId, role, userData }) => {
    const ref = useRef<HTMLVideoElement>(null);
    const [imgError, setImgError] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    useEffect(() => {
        const handleStream = (stream: MediaStream) => {
            if (ref.current) {
                ref.current.srcObject = stream;
            }

            // Audio Analysis Setup
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }

            if (audioContextRef.current && stream.getAudioTracks().length > 0) {
                // Close previous context/source if they exist to avoid leaks/errors on re-render
                if (sourceRef.current) {
                    // sourceRef.current.disconnect(); // Sometimes causes issues if context is closed
                }

                try {
                    analyserRef.current = audioContextRef.current.createAnalyser();
                    analyserRef.current.fftSize = 512;
                    sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
                    sourceRef.current.connect(analyserRef.current);

                    const bufferLength = analyserRef.current.frequencyBinCount;
                    const dataArray = new Uint8Array(bufferLength);

                    const checkAudio = () => {
                        if (!analyserRef.current) return;
                        analyserRef.current.getByteFrequencyData(dataArray);

                        let sum = 0;
                        for (let i = 0; i < bufferLength; i++) {
                            sum += dataArray[i];
                        }
                        const average = sum / bufferLength;

                        // Threshold for "speaking" - adjust as needed
                        setIsSpeaking(average > 10);

                        requestAnimationFrame(checkAudio);
                    };
                    checkAudio();
                } catch (e) {
                    console.error("Audio analysis setup failed", e);
                }
            }
        };

        peer.on("stream", handleStream);

        // Cleanup
        return () => {
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
                audioContextRef.current = null;
            }
        }
    }, [peer]);

    useEffect(() => {
        setImgError(false); // Reset error when userData changes
    }, [userData?.image]);

    const getInitials = (name: string) => {
        return name?.charAt(0)?.toUpperCase() || '?';
    };

    return (
        <div className={`relative w-full max-w-md aspect-video bg-black rounded-lg overflow-hidden shadow-md border transition-all duration-200 ${isSpeaking ? 'border-green-500 border-4 shadow-green-500/50' : 'border-gray-700'}`}>
            <video ref={ref} autoPlay playsInline className="w-full h-full object-cover" />

            {/* Speaking Indicator Icon */}
            {isSpeaking && (
                <div className="absolute top-4 right-4 bg-green-600 p-2 rounded-full animate-pulse z-10">
                    <Mic className="text-white w-4 h-4" />
                </div>
            )}

            <div className="absolute bottom-4 left-4 text-white bg-black/50 px-2 py-1 rounded flex items-center gap-2">
                {userData?.image && !imgError ? (
                    <img
                        src={userData.image}
                        alt={userData.name}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
                        {getInitials(userData?.name || userId || '')}
                    </div>
                )}
                <span className="text-sm font-medium">
                    {userData?.name ? `${userData.name} (${role})` : (userId ? `${userId} (${role})` : 'Participant')}
                </span>
            </div>
        </div>
    );
};

export default VideoMeeting;
