import api from "./api";

export const getAllComplaints = async (page: number, limit: number) => {
    const response = await api.get(`/admin/all-complaints?page=${page}&limit=${limit}`);
    return response.data;
}

export const resolveComplaint = async (id: string, feedback: string) => {
    const response = await api.patch(`/admin/${id}/resolve`, { feedback });
    return response.data;
}
