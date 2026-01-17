import { useState } from 'react'
import { Container, Box, TextField, Button, Typography, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { blogService } from '../../services/blogService'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

function BlogCreate() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      if (image) formData.append('image', image)
      await blogService.createBlog(formData)
      navigate('/')
    } catch (err) { setError('Failed to create blog') } 
    finally { setLoading(false) }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Create New Blog</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Title" value={title} onChange={e => setTitle(e.target.value)} sx={{ mb: 2 }} required />
        <ReactQuill theme="snow" value={content} onChange={setContent} style={{ height: 300, marginBottom: 20 }} />
        <Button variant="contained" component="label" sx={{ mb: 2 }}>
          Upload Image
          <input type="file" hidden onChange={e => setImage(e.target.files[0])} />
        </Button>
        <Box>
          <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Creating...' : 'Create Blog'}</Button>
        </Box>
      </form>
    </Container>
  )
}

export default BlogCreate
