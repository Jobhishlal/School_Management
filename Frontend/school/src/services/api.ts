import axios from 'axios';
const BASE_URL = 'http://localhost:5000';


const api = axios.create({
    baseURL:BASE_URL,
    headers:{"Content-Type":"application/json"},
    withCredentials:true
})

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem("accessToken")
    if(token){
        config.headers.Authorization=`Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
 res => res,
 async err =>{
    const orginal = err.config;
    if(err.response?.status === 401 && !orginal._retry){
        orginal._retry=true;

        try {
            const resp = await axios.post(`${BASE_URL}/auth/refresh`,{},{
                withCredentials:true
            })
            const {accessToken}=resp.data;
            localStorage.setItem("accessToken",accessToken)
            orginal.headers.Authorization = `Bearer ${accessToken}`;
            return api(orginal)
        } catch  {
            localStorage.removeItem("accessToken")
            window.location.href='/signup'
        }
    }
    return Promise.reject(err)
 }

)

export default api