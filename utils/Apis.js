import axios from "axios";

const BASE_URL = 'http://192.168.113.104:8000/';

export const endpoints = {
    'categories': '/categories/',
    'register': '/users/',
    'tags': '/tags/',
    'login': '/api/login/',
    'current_user': '/users/current-user/',
    'courses': '/courses/',
    'course_detail': (courseId) => `/courses/${courseId}/`,
    'lessons': (courseId) => `/courses/${courseId}/lessons/`,
    'lesson_detail': (lessonId) => `/lessons/${lessonId}/`,
    'reviews': (courseId) => `/courses/${courseId}/reviews/`,
    'instructors': '/instructors/',
    'enroll': '/enrollments/',
    'my_courses': `/users/enrolled-courses/`,
    'teacher_courses': (teacherId) => `/users/${teacherId}/courses/`,
    'hide_lesson': (lessonId) => `/lessons/${lessonId}/hide/`,
    'unhide_lesson': (lessonId) => `/lessons/${lessonId}/unhide/`,
    'hide_course': (courseId) => `/courses/${courseId}/hide/`,
    'unhide_course': (courseId) => `/courses/${courseId}/unhide/`,
    'stats':'/stats/dashboard/',
    'transactions':'/transactions/',
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