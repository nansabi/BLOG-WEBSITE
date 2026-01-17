import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material'
import { CloudUpload, ArrowLeft } from 'lucide-react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { blogService } from '../services/blogService'

function EditBlogPage() {
  const { blogId } = useParams()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchBlog()
  }, [blogId])

  const fetchBlog = async () => {
    try {
      const data = await blogService.getBlogById(blogId)
      setTitle(data.title)
      setContent(data.content)
      if (data.image) setPreview(data.image)
    } catch (err) {
      setError('Failed to fetch blog')
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      if (image) formData.append('image', image)

      await blogService.updateBlog(blogId, formData)
      navigate(`/blog/${blogId}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update blog')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Container maxWidth="md" sx={{ py: 6 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 6, cursor: 'pointer' }} onClick={() => navigate(-1)}>
          <ArrowLeft size={24} style={{ color: '#374151' }} />
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 500, color: '#6b7280', letterSpacing: 0.5 }}>
            BACK
          </Typography>
        </Box>

        {/* Main Card */}
        <Box
          sx={{
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
            p: { xs: 4, md: 6 },
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
          }}
        >
          {/* Title */}
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
            }}
          >
            Edit Article
          </Typography>
          <Typography sx={{ color: '#9ca3af', mb: 6, fontSize: '0.95rem' }}>
            Update your blog post with refined content and imagery
          </Typography>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 4,
                background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                border: 'none',
                borderRadius: '12px',
                '& .MuiAlert-icon': { color: '#dc2626' },
                color: '#991b1b',
                fontWeight: 500,
              }}
            >
              {error}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit}>
            {/* Title Field */}
            <Box sx={{ mb: 5 }}>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151', mb: 2, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Article Title
              </Typography>
              <TextField
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your article title"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '1.05rem',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    border: '2px solid #e5e7eb',
                    '&:hover': { borderColor: '#d1d5db' },
                    '&.Mui-focused': {
                      borderColor: '#3b82f6',
                      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                    },
                  },
                  '& .MuiOutlinedInput-input::placeholder': {
                    color: '#d1d5db',
                    opacity: 1,
                  },
                }}
              />
            </Box>

            {/* Content Editor */}
            <Box sx={{ mb: 5 }}>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151', mb: 2, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Content
              </Typography>
              <Box
                sx={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '2px solid #e5e7eb',
                  transition: 'all 0.3s ease',
                  '&:hover': { borderColor: '#d1d5db' },
                  '&:focus-within': {
                    borderColor: '#3b82f6',
                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                  },
                }}
              >
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  style={{ height: 320 }}
                  modules={{ toolbar: [['bold', 'italic', 'underline'], [{ header: [2, 3] }], ['link', 'blockquote', 'code-block'], ['clean']] }}
                />
              </Box>
            </Box>

            {/* Image Upload */}
            <Box sx={{ mb: 5 }}>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151', mb: 3, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Featured Image
              </Typography>
              <Box
                component="label"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  p: 4,
                  borderRadius: '12px',
                  border: '2px dashed #d1d5db',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                  '&:hover': {
                    borderColor: '#3b82f6',
                    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                  },
                }}
              >
                <CloudUpload size={32} style={{ color: '#3b82f6' }} />
                <Typography sx={{ textAlign: 'center', fontWeight: 600, color: '#1f2937' }}>
                  Click to upload or drag and drop
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                  PNG, JPG, GIF up to 10MB
                </Typography>
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
              </Box>

              {/* Image Preview */}
              {preview && (
                <Box sx={{ mt: 4 }}>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151', mb: 3, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                    Preview
                  </Typography>
                  <Box
                    component="img"
                    src={preview}
                    alt="preview"
                    sx={{
                      width: '100%',
                      maxHeight: 320,
                      objectFit: 'cover',
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e5e7eb',
                    }}
                  />
                </Box>
              )}
            </Box>

            {/* Submit Button */}
            <Box sx={{ display: 'flex', gap: 3, pt: 3 }}>
              <Button
                type="submit"
                disabled={loading}
                sx={{
                  flex: 1,
                  py: 1.5,
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: '#fff',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)',
                  '&:hover:not(:disabled)': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 30px rgba(59, 130, 246, 0.4)',
                  },
                  '&:disabled': { opacity: 0.6, cursor: 'not-allowed' },
                }}
              >
                {loading ? 'Publishing Changes...' : 'Publish Changes'}
              </Button>
              <Button
                type="button"
                onClick={() => navigate(-1)}
                sx={{
                  py: 1.5,
                  px: 3,
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  color: '#6b7280',
                  background: '#f3f4f6',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: '#e5e7eb',
                    color: '#374151',
                  },
                }}
              >
                Discard
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </div>
  )
}

export default EditBlogPage