import { createContext, useState, useEffect } from 'react'
import { initSocket, onNewNotification } from '../services/socketService'
import { notificationService } from '../services/notificationService'

export const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    initSocket()
    fetchNotifications()
    onNewNotification((data) => {
      setNotifications(prev => [data, ...prev])
      setUnreadCount(prev => prev + 1)
    })
  }, [])

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications()
      setNotifications(data)
      setUnreadCount(data.length)
    } catch (err) { console.error(err) }
  }

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id)
      setNotifications(prev => prev.filter(n => n._id !== id))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) { console.error(err) }
  }

  return <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, fetchNotifications }}>{children}</NotificationContext.Provider>
}
