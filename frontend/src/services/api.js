import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in development
    if (import.meta.env.VITE_ENABLE_CONSOLE_LOGS === 'true') {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (import.meta.env.VITE_ENABLE_CONSOLE_LOGS === 'true') {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/api/auth/refresh-token', { refreshToken });
        const { token } = response.data;
        
        localStorage.setItem('token', token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        // Retry original request with new token
        return api(originalRequest);
      } catch (err) {
        // Refresh failed, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    
    // Handle other errors
    const errorMessage = error.response?.data?.error?.message || error.message || 'An error occurred';
    
    console.error('API Error:', {
      status: error.response?.status,
      message: errorMessage,
      url: error.config?.url,
    });
    
    return Promise.reject({
      ...error,
      message: errorMessage,
      status: error.response?.status,
    });
  }
);

// API service methods
export const apiService = {
  // Health check
  healthCheck: () => api.get('/health'),
  
  // Authentication
  auth: {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
    refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
    verifyEmail: (token) => api.post('/auth/verify-email', { token }),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
  },
  
  // Users
  users: {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
    changePassword: (data) => api.put('/users/change-password', data),
  },
  
  // Projects
  projects: {
    getAll: (params) => api.get('/projects', { params }),
    getById: (id) => api.get(`/projects/${id}`),
    create: (data) => api.post('/projects', data),
    update: (id, data) => api.put(`/projects/${id}`, data),
    delete: (id) => api.delete(`/projects/${id}`),
    
    // Project members
    getMembers: (id) => api.get(`/projects/${id}/members`),
    addMember: (id, data) => api.post(`/projects/${id}/members`, data),
    updateMemberRole: (projectId, userId, data) => api.put(`/projects/${projectId}/members/${userId}`, data),
    removeMember: (projectId, userId) => api.delete(`/projects/${projectId}/members/${userId}`),
  },
  
  // Boards
  boards: {
    getByProject: (projectId) => api.get(`/projects/${projectId}/boards`),
    getById: (id, params) => api.get(`/boards/${id}`, { params }),
    create: (projectId, data) => api.post(`/projects/${projectId}/boards`, data),
    update: (id, data) => api.put(`/boards/${id}`, data),
    delete: (id) => api.delete(`/boards/${id}`),
  },
  
  // Sprints
  sprints: {
    getByBoard: (boardId, params) => api.get(`/boards/${boardId}/sprints`, { params }),
    create: (boardId, data) => api.post(`/boards/${boardId}/sprints`, data),
    start: (id) => api.put(`/sprints/${id}/start`),
    complete: (id, data) => api.put(`/sprints/${id}/complete`, data),
  },
  
  // Issues
  issues: {
    getByBoard: (boardId, params) => api.get(`/boards/${boardId}/issues`, { params }),
    getById: (id) => api.get(`/issues/${id}`),
    create: (boardId, data) => api.post(`/boards/${boardId}/issues`, data),
    update: (id, data) => api.put(`/issues/${id}`, data),
    delete: (id) => api.delete(`/issues/${id}`),
    
    // Comments
    getComments: (issueId) => api.get(`/issues/${issueId}/comments`),
    addComment: (issueId, data) => api.post(`/issues/${issueId}/comments`, data),
    updateComment: (id, data) => api.put(`/comments/${id}`, data),
    deleteComment: (id) => api.delete(`/comments/${id}`),
    
    // Time logs
    getTimeLogs: (issueId) => api.get(`/issues/${issueId}/time-logs`),
    logTime: (issueId, data) => api.post(`/issues/${issueId}/time-logs`, data),
    updateTimeLog: (id, data) => api.put(`/time-logs/${id}`, data),
    deleteTimeLog: (id) => api.delete(`/time-logs/${id}`),
  },
  
  // AI Features
  ai: {
    sprintPlanning: (projectId, data) => api.post(`/projects/${projectId}/ai/sprint-planning`, data),
    scopeCreepDetection: (projectId, data) => api.post(`/projects/${projectId}/ai/scope-creep-detection`, data),
    riskAssessment: (projectId, data) => api.post(`/projects/${projectId}/ai/risk-assessment`, data),
    retrospective: (projectId, data) => api.post(`/projects/${projectId}/ai/retrospective`, data),
    getQuota: (projectId) => api.get(`/projects/${projectId}/ai/quota`),
  },
};

export default api;
