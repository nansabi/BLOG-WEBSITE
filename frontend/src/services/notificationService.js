import api from './api'

export const notificationService = {
  getNotifications: () => api.get('/notifications').then(res => res.data),
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`).then(res => res.data),
}
