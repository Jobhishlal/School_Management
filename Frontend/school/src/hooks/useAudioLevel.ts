import { useEffect, useRef, useState } from 'react';

export const useAudioLevel = (stream: MediaStream | null) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        if (!stream || stream.getAudioTracks().length === 0) {
            setIsSpeaking(false);
            return;
        }

        const handleStream = () => {
            try {
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                if (!audioContextRef.current) {
                    audioContextRef.current = new AudioContextClass();
                }

                if (audioContextRef.current.state === 'suspended') {
                    audioContextRef.current.resume();
                }

                if (sourceRef.current) {
                    try { sourceRef.current.disconnect(); } catch (e) { }
                }

                analyserRef.current = audioContextRef.current.createAnalyser();
                analyserRef.current.fftSize = 256;
                sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
                sourceRef.current.connect(analyserRef.current);

                const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

                const checkAudio = () => {
                    if (!analyserRef.current) return;
                    analyserRef.current.getByteFrequencyData(dataArray);

                
                    const volume = dataArray.reduce((src, a) => src + a, 0) / dataArray.length;

       
                    setIsSpeaking(volume > 15);

                    animationFrameRef.current = requestAnimationFrame(checkAudio);
                };

                checkAudio();
            } catch (e) {
                console.error("Audio setup error", e);
            }
        };

        handleStream();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
       
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close().catch(() => { });
                audioContextRef.current = null;
            }
        };
    }, [stream]);

    return isSpeaking;
};
