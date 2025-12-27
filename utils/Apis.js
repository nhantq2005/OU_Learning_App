import axios from "axios";

const BASE_URL = 'http://192.168.113.101:8000/';

export const endpoints = {
    'categories': '/categories/',
    'register': '/users/',
    // 'login': '/o/token/',
    'login': '/api/login/',
    'current_user': '/users/current-user/'
};


export const authApis = (token) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
};

export default axios.create({
    baseURL: BASE_URL
});