import { Box, Typography, Paper, Button } from '@mui/material'
import { useNotifications } from '../../hooks/useNotifications'
import { formatDate } from '../../utils/formatters'

function NotificationPanel() {
  const { notifications, markAsRead } = useNotifications()

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Notifications</Typography>
      {notifications.length === 0 && <Typography>No notifications</Typography>}
      {notifications.map((n) => (
        <Paper key={n._id} sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography>{n.message}</Typography>
            <Typography variant="caption" color="textSecondary">{formatDate(n.createdAt)}</Typography>
          </Box>
          <Button size="small" onClick={() => markAsRead(n._id)}>Mark Read</Button>
        </Paper>
      ))}
    </Box>
  )
}

export default NotificationPanel
