import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../../../services/api';

interface ClassOptions {
    id: string;
    className: string;
    division: string;
}

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    isDark: boolean;
}

export default function CreateGroupModal({ isOpen, onClose, onSuccess, isDark }: CreateGroupModalProps) {
    const [classes, setClasses] = useState<ClassOptions[]>([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadClasses();
        }
    }, [isOpen]);

    const loadClasses = async () => {
        try {
            setLoading(true);
            
            const response = await api.get('/teacher/get-all-classes');
        
            const data = response.data.data || response.data;

            const options = Array.isArray(data) ? data.map((c: any) => ({
                id: c._id || c.id,
                className: c.className,
                division: c.division
            })) : [];

            setClasses(options);
        } catch (error) {
            console.error("Failed to load classes", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!selectedClassId) return;

        try {
            setCreating(true);
            await api.post('/chat/group/create', { classId: selectedClassId });
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to create group", error);
            alert("Failed to create group");
        } finally {
            setCreating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className={`w-full max-w-md rounded-2xl p-6 shadow-xl ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'
                }`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Create Class Group</h2>
                    <button onClick={onClose} className={`p-2 rounded-full transition ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            Select Class
                        </label>
                        {loading ? (
                            <div className="flex justify-center py-4">
                                <Loader2 className="animate-spin" />
                            </div>
                        ) : (
                            <select
                                value={selectedClassId}
                                onChange={(e) => setSelectedClassId(e.target.value)}
                                className={`w-full p-3 rounded-xl outline-none border transition ${isDark
                                    ? 'bg-slate-700 border-slate-600 focus:border-blue-500 text-white'
                                    : 'bg-slate-50 border-slate-200 focus:border-blue-500 text-slate-900'
                                    }`}
                            >
                                <option value="">Select a class...</option>
                                {classes.map(cls => (
                                    <option key={cls.id} value={cls.id}>
                                        Class {cls.className} - {cls.division}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className={`px-4 py-2 rounded-xl transition ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={!selectedClassId || creating}
                            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                        >
                            {creating && <Loader2 size={16} className="animate-spin" />}
                            Create Group
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
