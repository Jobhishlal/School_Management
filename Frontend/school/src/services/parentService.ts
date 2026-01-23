import api from "./api";

export const createComplaint = async (concernTitle: string, description: string) => {
    try {
        const response = await api.post('/parents/complaint/create', { concernTitle, description });

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getMyComplaints = async () => {
    try {
        const response = await api.get('/parents/complaints/my');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateComplaint = async (id: string, concernTitle: string, description: string) => {
    try {
        const response = await api.put(`/parents/complaint/update/${id}`, { concernTitle, description });
        return response.data;
    } catch (error) {
        throw error;
    }
};
