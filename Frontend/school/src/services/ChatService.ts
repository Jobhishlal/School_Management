import api from './api';

export interface ChatMessage {
    _id: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: string;
    read: boolean;
    type: 'text' | 'image' | 'file';
}

export interface ChatUser {
    _id: string;
    name: string;
    email: string;
    profileImage: string;
    role: string;
    lastMessage?: ChatMessage;
    isGroup?: boolean;
    isOnline?: boolean;
    participants?: {
        participantId: ChatUser;
        participantModel: string;
    }[];
}

export type TeacherForChat = ChatUser;
export type StudentForChat = ChatUser;

export interface Conversation {
    _id: string;
    participants: {
        participantId: ChatUser;
        participantModel: string;
    }[];
    lastMessage: ChatMessage;
    updatedAt: string;
    isGroup?: boolean;
    groupName?: string;
    unreadCount?: number;
}

export const getTeachersForChat = async (): Promise<TeacherForChat[]> => {
    try {
        const response = await api.get('/chat/teachers');
        return response.data.data;
    } catch (error) {
        console.error("Error fetching teachers:", error);
        throw error;
    }
}

export const getConversations = async (): Promise<Conversation[]> => {
    try {
        const response = await api.get('/chat/conversations');
        return response.data.data;
    } catch (error) {
        console.error("Error fetching conversations:", error);
        throw error;
    }
}

export const getChatHistory = async (otherUserId: string): Promise<ChatMessage[]> => {
    try {
        const response = await api.get(`/chat/history/${otherUserId}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching chat history:", error);
        throw error;
    }
}

export const markMessagesRead = async (otherUserId: string): Promise<void> => {
    try {
        await api.put('/chat/read', { otherUserId });
    } catch (error) {
        console.error("Error marking messages read:", error);
    }
}

export const searchUsers = async (query: string, role?: string): Promise<ChatUser[]> => {
    try {
        const response = await api.get(`/chat/search?query=${encodeURIComponent(query)}${role ? `&role=${role}` : ''}`);
        return response.data.data;
    } catch (error) {
        console.error("Error searching users:", error);
        return [];
    }
}
