import { useState, useEffect } from 'react'
import { Typography, List, ListItem, ListItemText, IconButton, Divider } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import api from '../../services/api'

function BlogModeration() {
  const [blogs, setBlogs] = useState([])

  useEffect(() => { fetchBlogs() }, [])

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/blogs')
      setBlogs(res.data.blogs)
    } catch (err) { console.error(err) }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this blog?')) {
      try {
        await api.delete(`/admin/blogs/${id}`)
        fetchBlogs()
      } catch (err) { console.error(err) }
    }
  }

  return (
    <>
      <Typography variant="h6">Blogs</Typography>
      <List>
        {blogs.map(b => (
          <div key={b.blogId}>
            <ListItem secondaryAction={
              <IconButton edge="end" onClick={() => handleDelete(b.blogId)}><DeleteIcon /></IconButton>
            }>
              <ListItemText primary={b.title} secondary={`Author: ${b.author}`} />
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </>
  )
}

export default BlogModeration
