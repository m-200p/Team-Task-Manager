import api from './api';

export const authService = {
  login:  (email, password)        => api.post('/auth/login', { email, password }),
  signup: (name, email, password, role) => api.post('/auth/signup', { name, email, password, role }),
  me:     ()                       => api.get('/auth/me')
};