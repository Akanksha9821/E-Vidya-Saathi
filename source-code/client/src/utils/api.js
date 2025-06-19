import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get token from storage
const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on unauthorized
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
    updateDetails: '/auth/updatedetails',
    updatePassword: '/auth/updatepassword',
    forgotPassword: '/auth/forgotpassword',
    resetPassword: (token) => `/auth/resetpassword/${token}`,
    createUser: '/auth/create-user',
  },
  // Users
  users: {
    getAll: '/users',
    getById: (id) => `/users/${id}`,
    update: (id) => `/users/${id}`,
    delete: (id) => `/users/${id}`,
    profile: '/users/profile',
  },
  // Courses
  courses: {
    getAll: '/courses',
    getById: (id) => `/courses/${id}`,
    create: '/courses',
    update: (id) => `/courses/${id}`,
    delete: (id) => `/courses/${id}`,
    enroll: (id) => `/courses/${id}/enroll`,
    unenroll: (id) => `/courses/${id}/enroll`,
    getStudents: (id) => `/courses/${id}/students`,
    getEnrolled: '/courses/student/enrolled',
    getFacultyCourses: '/courses/faculty/courses',
  },
  // Events
  events: {
    getAll: '/events',
    getById: (id) => `/events/${id}`,
    create: '/events',
    update: (id) => `/events/${id}`,
    delete: (id) => `/events/${id}`,
    register: (id) => `/events/${id}/register`,
    unregister: (id) => `/events/${id}/unregister`,
    getRegistrations: (id) => `/events/${id}/registrations`,
    getMyEvents: '/events/my/events',
  },
  // Placements
  placements: {
    getAll: '/placements',
    getById: (id) => `/placements/${id}`,
    create: '/placements',
    update: (id) => `/placements/${id}`,
    delete: (id) => `/placements/${id}`,
    apply: (id) => `/placements/${id}/apply`,
    getApplications: (id) => `/placements/${id}/applications`,
    getStudentApplications: '/placements/student/applications',
    getFacultyJobs: '/placements/faculty/jobs',
  },
  // Jobs
  jobs: {
    getAll: '/jobs',
    getById: (id) => `/jobs/${id}`,
    create: '/jobs',
    update: (id) => `/jobs/${id}`,
    delete: (id) => `/jobs/${id}`,
    apply: (id) => `/jobs/${id}/apply`,
    withdraw: (id) => `/jobs/${id}/withdraw`,
    getApplications: (id) => `/jobs/${id}/applications`,
    getMyApplications: '/jobs/applications/my',
  },
  // Attendance
  attendance: {
    getStudentAttendance: '/attendance/student/attendance',
    getCourseAttendance: (courseId) => `/attendance/course/${courseId}`,
    getCourseStats: (courseId) => `/attendance/course/${courseId}/stats`,
    create: (courseId) => `/attendance/course/${courseId}`,
    update: (id) => `/attendance/${id}`,
    delete: (id) => `/attendance/${id}`,
  },
  // Matching
  matching: {
    getStudentMatches: (studentId) => `/matching/student/${studentId}`,
    getStudentJobs: (studentId) => `/matching/student/${studentId}/jobs`,
    getCourseMatches: (courseId) => `/matching/course/${courseId}`,
    getJobMatches: (jobId) => `/matching/job/${jobId}`,
  },
  // Interests
  interests: {
    getAll: '/interests',
    getById: (id) => `/interests/${id}`,
    create: '/interests',
    update: (id) => `/interests/${id}`,
    delete: (id) => `/interests/${id}`,
    getUserInterests: '/interests/user/interests',
    getCourseInterests: (courseId) => `/interests/course/${courseId}`,
  },
  // Upload
  upload: {
    profilePicture: '/upload/profile-picture',
    resume: '/upload/resume',
    courseMaterial: '/upload/course-material',
    eventImage: '/upload/event-image',
    general: '/upload',
    getFile: (filename) => `/upload/${filename}`,
    deleteFile: (filename) => `/upload/${filename}`,
  },
};

export default api;
export { API_BASE_URL, API_URL }; 