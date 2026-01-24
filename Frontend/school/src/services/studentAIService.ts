import api from "./api";

export const askAIDoubt = async (question: string) => {
    const res = await api.post('/student/ai/ask', { question });
    return res.data;
}
