export const webrtcConfig = {
  signalingPath: process.env.RTC_SIGNALING_PATH || '/socket.io',
  publicIp: process.env.PUBLIC_IP || '127.0.0.1',
  rtcMinPort: parseInt(process.env.RTC_MIN_PORT || '40000'),
  rtcMaxPort: parseInt(process.env.RTC_MAX_PORT || '49999'),
  iceServers: (process.env.RTC_STUN_SERVERS || 'stun:stun.l.google.com:19302').split(',').map(url => ({ urls: url }))
};
