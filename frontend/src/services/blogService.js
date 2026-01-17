import api from './api'

export const blogService = {
  getBlogs: (page=1, limit=5, search='', sort='newest') =>
    api.get('/blogs', { params: { page, limit, search, sort } }).then(res => res.data),
  
  getTrendingBlogs: () => api.get('/blogs/trending').then(res => res.data),
  getBlogById: (blogId) => api.get(`/blogs/${blogId}`).then(res => res.data),
  
  createBlog: (formData) =>
    api.post('/blogs', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => res.data),
  
  updateBlog: (blogId, data) => api.put(`/blogs/${blogId}`, data).then(res => res.data),
  deleteBlog: (blogId) => api.delete(`/blogs/${blogId}`).then(res => res.data),

  likeBlog: (blogId) => api.post(`/blogs/${blogId}/like`).then(res => res.data),
  unlikeBlog: (blogId) => api.post(`/blogs/${blogId}/unlike`).then(res => res.data),
}
