
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8">

              
                <div className="relative w-64 h-64 mx-auto">
                    <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-pulse"></div>
                    <div className="absolute inset-4 bg-blue-500/20 rounded-full"></div>
                    <div className="relative flex items-center justify-center h-full">
                        <span className="text-9xl font-bold text-blue-600 dark:text-blue-500 tracking-tighter drop-shadow-lg">
                            404
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Page Not Found
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Oops! The page you are looking for keeps escaping us. It might have been moved or doesn't exist.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all focus:ring-2 focus:ring-slate-200"
                    >
                        <ArrowLeft size={20} />
                        Go Back
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                    >
                        <Home size={20} />
                        Go Home
                    </button>
                </div>
            </div>

            <footer className="mt-16 text-sm text-slate-400 dark:text-slate-600">
                School Management System
            </footer>
        </div>
    );
};

export default NotFound;
