import { useState, useEffect } from 'react'
import { Typography, List, ListItem, ListItemText, IconButton, Divider } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import api from '../../services/api'

function UserManagement() {
  const [users, setUsers] = useState([])

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users')
      setUsers(res.data)
    } catch (err) { console.error(err) }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this user?')) {
      try {
        await api.delete(`/admin/users/${id}`)
        fetchUsers()
      } catch (err) { console.error(err) }
    }
  }

  return (
    <>
      <Typography variant="h6">Users</Typography>
      <List>
        {users.map(u => (
          <div key={u._id}>
            <ListItem secondaryAction={
              <IconButton edge="end" onClick={() => handleDelete(u._id)}><DeleteIcon /></IconButton>
            }>
              <ListItemText primary={u.name} secondary={u.email} />
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </>
  )
}

export default UserManagement
