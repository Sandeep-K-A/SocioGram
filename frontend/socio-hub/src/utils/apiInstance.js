import axios from "axios";

const apiInstance = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
});

export default apiInstance;