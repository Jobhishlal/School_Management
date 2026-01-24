import axios from 'axios';
const BASE_URL = 'http://localhost:5000';


const api = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true
})

api.interceptors.request.use((config) => {
    let token = localStorage.getItem("accessToken");

    // Select specific token based on route prefix to allow multi-role login
    if (config.url?.startsWith('/admin') || config.url?.startsWith('/superadmin')) {
        const adminToken = localStorage.getItem("adminAccessToken");
        if (adminToken) token = adminToken;
    } else if (config.url?.startsWith('/teacher')) {
        const teacherToken = localStorage.getItem("teacherAccessToken");
        if (teacherToken) token = teacherToken;
    } else if (config.url?.startsWith('/student')) {
        const studentToken = localStorage.getItem("studentAccessToken");
        if (studentToken) token = studentToken;
    } else if (config.url?.startsWith('/parents')) {
        const parentToken = localStorage.getItem("parentAccessToken");
        if (parentToken) token = parentToken;
    } else if (config.url?.startsWith('/meeting')) {
        // Meeting routes are shared, check for any available token
        token = localStorage.getItem("adminAccessToken") ||
            localStorage.getItem("teacherAccessToken") ||
            localStorage.getItem("studentAccessToken") ||
            localStorage.getItem("parentAccessToken") ||
            localStorage.getItem("accessToken");
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    res => res,
    async err => {
        const orginal = err.config;
        if (err.response?.status === 401 && !orginal._retry) {
            orginal._retry = true;

            try {
                const resp = await axios.post(`${BASE_URL}/auth/refresh`, {}, {
                    withCredentials: true
                })
                const { accessToken } = resp.data;
                localStorage.setItem("accessToken", accessToken)
                orginal.headers.Authorization = `Bearer ${accessToken}`;
                return api(orginal)
            } catch {
                localStorage.removeItem("accessToken")
                window.location.href = '/signup'
            }
        }
        return Promise.reject(err)
    }

)


// function to get all complaints
export const getAllComplaints = async (page: number, limit: number) => {
    const response = await api.get(`/admin/all-complaints?page=${page}&limit=${limit}`);
    return response.data;
}

export const resolveComplaint = async (id: string, feedback: string) => {
    const response = await api.patch(`/admin/${id}/resolve`, { feedback });
    return response.data;
}

export default api