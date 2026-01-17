import api from './api'

export const commentService = {
  getComments: (blogId) => api.get(`/blogs/${blogId}/comments`).then(res => res.data),
  createComment: (blogId, text) => api.post(`/blogs/${blogId}/comments`, { text }).then(res => res.data),
}
