import io from 'socket.io-client'
import { SOCKET_URL } from '../utils/constants'
import { getUser } from '../utils/tokenStorage'

let socket = null

export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, { reconnection: true, reconnectionDelay: 1000, reconnectionDelayMax: 5000 })
    socket.on('connect', () => {
      const user = getUser()
      if (user?._id) socket.emit('register', user._id)
    })
  }
  return socket
}

export const getSocket = () => socket
export const disconnectSocket = () => { if (socket) { socket.disconnect(); socket = null } }

export const onNewComment = (callback) => { const s = getSocket(); if(s) s.on('newComment', callback) }
export const onNewNotification = (callback) => { const s = getSocket(); if(s) s.on('newNotification', callback) }
export const joinBlogRoom = (blogId) => { const s = getSocket(); if(s) s.emit('joinBlog', `blog_${blogId}`) }
