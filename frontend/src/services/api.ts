import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type AxiosError,
  type AxiosRequestConfig,
} from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1';

// Create the axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Use type assertion to set the authorization header
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401) {
        // Unauthorized - Token expired or invalid
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (status === 403) {
        // Forbidden - User doesn't have permission
        console.error('Access denied: You do not have permission to perform this action');
      } else if (status === 404) {
        // Not found
        console.error('The requested resource was not found');
      } else if (status >= 500) {
        // Server error
        console.error('A server error occurred. Please try again later.');
      }
      
      console.error('Response error:', error.response.data);
      console.error('Status:', status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request
      console.error('Error setting up the request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email: string, password: string): Promise<AxiosResponse> => 
    api.post('/auth/login', { email, password }),
  
  register: (name: string, email: string, password: string, role: string): Promise<AxiosResponse> => 
    api.post('/auth/register', { name, email, password, role }),
  
  getProfile: () => api.get('/auth/me'),
};

// Appointments API
export const appointmentsApi = {
  getAppointments: () => api.get('/appointments'),
  getAppointment: (id: string) => api.get(`/appointments/${id}`),
  createAppointment: (data: any) => api.post('/appointments', data),
  updateAppointment: (id: string, data: any) => api.put(`/appointments/${id}`, data),
  deleteAppointment: (id: string) => api.delete(`/appointments/${id}`),
};

// Doctors API
export const doctorsApi = {
  getDoctors: () => api.get('/doctors'),
  getDoctor: (id: string) => api.get(`/doctors/${id}`),
  getAvailableSlots: (doctorId: string, date: string) => 
    api.get(`/doctors/${doctorId}/slots?date=${date}`),
};

// Users API
export const usersApi = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data: any) => api.put('/users/me', data),
};

export default api;
