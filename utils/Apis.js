import axios from "axios";

const BASE_URL = 'http://192.168.113.109:8000/';

export const endpoints = {
    'categories': '/categories/',
    'register': '/users/',
    'tags': '/tags/',
    'login': '/api/login/',
    'current_user': '/users/current-user/',
    'courses': '/courses/',
    'course_detail': (courseId) => `/courses/${courseId}/`,
    'lessons': (courseId) => `/courses/${courseId}/lessons/`,
    'reviews': (courseId) => `/courses/${courseId}/reviews/`,
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