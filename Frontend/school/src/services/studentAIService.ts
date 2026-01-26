import api from "./api";

export const askAIDoubt = async (question: string, sessionId?: string) => {
    const res = await api.post('/student/ai/ask', { question, sessionId });
    return res.data;
}

export const getChatHistory = async () => {
    const res = await api.get('/student/ai/history');
    return res.data;
}

export const getChatSession = async (sessionId: string) => {
    const res = await api.get(`/student/ai/session/${sessionId}`);
    return res.data;
}

export const deleteChatSession = async (sessionId: string) => {
    const res = await api.delete(`/student/ai/session/${sessionId}`);
    return res.data;
}
