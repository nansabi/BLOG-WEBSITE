import { IconButton, Badge, Menu, MenuItem } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { useState } from 'react'
import { useNotifications } from '../../hooks/useNotifications'

function NotificationBell() {
  const { notifications, unreadCount, markAsRead } = useNotifications()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const handleRead = (id) => {
    markAsRead(id)
  }

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {notifications.length === 0 && <MenuItem>No notifications</MenuItem>}
        {notifications.map((n) => (
          <MenuItem key={n._id} onClick={() => handleRead(n._id)}>
            {n.message}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default NotificationBell
