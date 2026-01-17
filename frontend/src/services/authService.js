import api from './api'

export const authService = {
  signup: (name, email, password) => api.post('/signup', { name, email, password }).then(res => res.data),
  login: (email, password) => api.post('/login', { email, password }).then(res => res.data),
}
