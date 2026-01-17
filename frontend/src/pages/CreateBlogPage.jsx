import { useState } from 'react'
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  IconButton,
  Paper,
  Card,
  LinearProgress,
  Tooltip
} from '@mui/material'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import EmojiPicker from 'emoji-picker-react'
import { blogService } from '../services/blogService'
import { useNavigate } from 'react-router-dom'

function CreateBlogPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)
  const navigate = useNavigate()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file && file.size <= 5000000) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    } else {
      setError('Image must be less than 5MB')
    }
  }

  const handleEmojiClick = (emojiData) => {
    setContent((prev) => prev + emojiData.emoji)
    setShowEmoji(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!title.trim()) return setError('Title is required')
    if (!content.trim()) return setError('Content is required')

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      if (image) formData.append('image', image)
      await blogService.createBlog(formData)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create blog')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 8,
        px: 2,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            Create New Blog
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
            Share your story with the world
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: '#ffffff',
            border: '1px solid #e0e0e0',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Title Field */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#333' }}>
                Blog Title *
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter an engaging title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                    fontSize: '1.1rem',
                    '&:hover fieldset': { borderColor: '#667eea' },
                    '&.Mui-focused fieldset': { borderColor: '#667eea', borderWidth: 2 },
                  },
                }}
              />
            </Box>

            {/* Content Editor */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                  Blog Content *
                </Typography>
                <Tooltip title="Add emoji">
                  <IconButton
                    onClick={() => setShowEmoji(!showEmoji)}
                    size="small"
                    sx={{
                      color: '#667eea',
                      '&:hover': { backgroundColor: '#f0f0f0' },
                    }}
                  >
                    <EmojiEmotionsIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              {showEmoji && (
                <Card sx={{ mb: 2, p: 2, backgroundColor: '#fafafa' }}>
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </Card>
              )}

              <Box
                sx={{
                  '& .ql-container': {
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                  },
                  '& .ql-toolbar': {
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    borderColor: '#e0e0e0',
                    backgroundColor: '#f8f9fa',
                  },
                  '& .ql-toolbar button:hover, & .ql-toolbar button.ql-active': {
                    color: '#667eea',
                  },
                }}
              >
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  style={{ height: 300, marginBottom: 0 }}
                  placeholder="Start writing your story here..."
                />
              </Box>
            </Box>

            {/* Image Upload */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                Featured Image
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{
                  mb: 2,
                  borderColor: '#667eea',
                  color: '#667eea',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  '&:hover': {
                    borderColor: '#764ba2',
                    backgroundColor: 'rgba(102, 126, 234, 0.05)',
                  },
                }}
              >
                Choose Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>

              {preview && (
                <Card
                  sx={{
                    overflow: 'hidden',
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                    mt: 2,
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      paddingBottom: '56.25%',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      component="img"
                      src={preview}
                      alt="preview"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                  <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon sx={{ color: '#4caf50' }} />
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {image.name}
                    </Typography>
                  </Box>
                </Card>
              )}
            </Box>

            {/* Submit Button */}
            <Box>
              {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  py: 1.8,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  transition: 'all 0.3s',
                  '&:hover:not(:disabled)': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 24px rgba(102, 126, 234, 0.4)',
                  },
                  '&:disabled': {
                    opacity: 0.7,
                  },
                }}
              >
                {loading ? 'Publishing...' : 'Publish Blog'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default CreateBlogPage