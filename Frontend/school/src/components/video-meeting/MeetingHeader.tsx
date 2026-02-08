import React from 'react';
import { Video } from 'lucide-react';

interface MeetingHeaderProps {
    meeting: any;
    peers: any[];
    waitingList: any[];
    admitUser: (socketId: string) => void;
    isDark: boolean;
}

const MeetingHeader: React.FC<MeetingHeaderProps> = ({
    meeting,
    peers,
    waitingList,
    admitUser,
    isDark
}) => {
    const [showLobby, setShowLobby] = React.useState(false);

    return (
        <header className={`px-4 md:px-6 py-3 md:py-4 flex items-center justify-between border-b backdrop-blur-md relative z-50 ${isDark ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'}`}>
            <div className="flex items-center gap-3 md:gap-4">
                <div className={`p-2 md:p-2.5 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm border border-gray-100'}`}>
                    <Video size={18} className="text-blue-500 md:w-5 md:h-5" />
                </div>
                <div className="min-w-0">
                    <h1 className="font-bold text-sm md:text-lg leading-tight tracking-tight truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">{meeting?.title || 'Video Meeting'}</h1>
                    <div className="flex items-center gap-1.5 md:gap-2 mt-0.5">
                        <span className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${peers.length > 0 ? 'bg-green-500' : 'bg-amber-500'}`} />
                        <p className="text-[10px] md:text-xs opacity-60 font-medium tracking-wide truncate">{meeting?.type?.toUpperCase()} • {peers.length + 1}</p>
                    </div>
                </div>
            </div>

            {waitingList.length > 0 && (
                <div className="relative">
                    <button
                        onClick={() => setShowLobby(!showLobby)}
                        className={`flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 ${showLobby ? 'bg-blue-700 ring-2 ring-blue-500/50' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-full text-xs md:text-sm font-medium transition-all shadow-lg shadow-blue-600/20 active:scale-95`}
                    >
                        <span>Lobby</span>
                        <span className="bg-white text-blue-600 px-1 md:px-1.5 py-0.5 rounded-full text-[10px] md:text-xs font-bold leading-none min-w-[18px] md:min-w-[20px] text-center">{waitingList.length}</span>
                    </button>

                    {/* Dropdown for Waiting List */}
                    {showLobby && (
                        <div className={`absolute top-full right-0 mt-2 w-[calc(100vw-32px)] sm:w-80 rounded-2xl shadow-2xl border p-3 z-50 animate-in fade-in slide-in-from-top-2 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
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
                                            onClick={() => {
                                                admitUser(user.socketId);
                                                if (waitingList.length <= 1) setShowLobby(false);
                                            }}
                                            className="text-xs bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:opacity-90 px-3 py-1.5 rounded-lg font-semibold transition-opacity"
                                        >
                                            Admit
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default MeetingHeader;
