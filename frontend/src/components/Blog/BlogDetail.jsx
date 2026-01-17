import { useState, useEffect } from 'react'
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Paper,
  Fade,
  Tooltip,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { blogService } from '../../services/blogService'
import { formatDate } from '../../utils/formatters'
import CommentList from '../Comments/CommentList'
import CommentForm from '../Comments/CommentForm'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PersonIcon from '@mui/icons-material/Person'

function BlogDetail({ blogId }) {
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [liked, setLiked] = useState(false)
  const [unliked, setUnliked] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchBlog()
  }, [blogId])

  const fetchBlog = async () => {
    try {
      const data = await blogService.getBlogById(blogId)
      setBlog(data)
      setLiked(data.likes.includes(user?._id))
      setUnliked(data.unlikes.includes(user?._id))
    } catch {
      setError('Failed to load blog')
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    try {
      await blogService.likeBlog(blogId)
      setLiked(!liked)
      fetchBlog()
    } catch {
      setError('Failed to like blog')
    }
  }

  const handleUnlike = async () => {
    try {
      await blogService.unlikeBlog(blogId)
      setUnliked(!unliked)
      fetchBlog()
    } catch {
      setError('Failed to unlike blog')
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await blogService.deleteBlog(blogId)
        navigate('/')
      } catch {
        setError('Failed to delete blog')
      }
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} sx={{ color: '#183064ff' }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error">{error}</Alert>
      </Container>
    )
  }

  if (!blog) return null

  const isAuthor = user?._id === blog.authorId
  const imageUrl = blog.image || '/placeholder-image.png'

  return (
    <Fade in timeout={700}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            border: '1px solid #E5E7EB',
            background: '#ffffff',
          }}
        >
          <Box
            component="img"
            src={imageUrl}
            alt={blog.title}
            sx={{
              width: '100%',
              height: { xs: 280, md: 480 },
              objectFit: 'cover',
            }}
          />

          <Box sx={{ px: { xs: 3, md: 6 }, py: 5 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '3rem' },
                color: '#0F172A',
                mb: 3,
              }}
            >
              {blog.title}
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              sx={{ mb: 4, pb: 3, borderBottom: '1px solid #E5E7EB' }}
            >
              <Chip
                icon={<PersonIcon />}
                label={blog.author}
                sx={{
                  backgroundColor: '#95b2f0ff',
                  color: '#fff',
                  fontWeight: 600,
                }}
              />
              <Chip
                icon={<AccessTimeIcon />}
                label={formatDate(blog.createdAt)}
                variant="outlined"
                sx={{ color: '#64748B', borderColor: '#CBD5E1' }}
              />
            </Stack>

            {isAuthor && (
              <Stack direction="row" spacing={1} sx={{ mb: 4 }}>
                <Tooltip title="Edit">
                  <Button
                    startIcon={<EditIcon />}
                    variant="outlined"
                    sx={{
                      borderColor: '#2563EB',
                      color: '#354b79ff',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: 'rgba(37,99,235,0.08)',
                      },
                    }}
                    onClick={() => navigate(`/edit/${blogId}`)}
                  >
                    Edit
                  </Button>
                </Tooltip>
                <Tooltip title="Delete">
                  <Button
                    startIcon={<DeleteIcon />}
                    variant="outlined"
                    color="error"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </Tooltip>
              </Stack>
            )}

            <Stack direction="row" spacing={2} sx={{ mb: 5 }}>
              <Button
                startIcon={<ThumbUpIcon />}
                onClick={handleLike}
                variant={liked ? 'contained' : 'outlined'}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  fontWeight: 600,
                  backgroundColor: liked ? '#2b3b5eff' : 'transparent',
                  color: liked ? '#fff' : '#2563EB',
                  borderColor: '#2563EB',
                  '&:hover': {
                    backgroundColor: '#1E40AF',
                    color: '#fff',
                  },
                }}
              >
                Like ({blog.likes.length})
              </Button>

              <Button
                startIcon={<ThumbDownIcon />}
                onClick={handleUnlike}
                variant={unliked ? 'contained' : 'outlined'}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  fontWeight: 600,
                  backgroundColor: unliked ? '#64748B' : 'transparent',
                  color: unliked ? '#fff' : '#64748B',
                  borderColor: '#CBD5E1',
                }}
              >
                Unlike ({blog.unlikes.length})
              </Button>
            </Stack>

            <Box
              sx={{
                fontSize: '1.1rem',
                lineHeight: 1.8,
                color: '#334155',
                '& h1,& h2,& h3': {
                  color: '#0F172A',
                  mt: 4,
                },
                '& a': {
                  color: '#213765ff',
                  textDecoration: 'none',
                  borderBottom: '2px solid rgba(37,99,235,0.3)',
                },
                '& blockquote': {
                  borderLeft: '4px solid #2563EB',
                  pl: 3,
                  fontStyle: 'italic',
                  backgroundColor: 'rgba(37,99,235,0.05)',
                },
              }}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            <Box sx={{ mt: 6, pt: 5, borderTop: '1px solid #E5E7EB' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Comments
              </Typography>
              <CommentForm blogId={blogId} onCommentAdded={fetchBlog} />
              <CommentList blogId={blogId} />
            </Box>
          </Box>
        </Paper>
      </Container>
    </Fade>
  )
}

export default BlogDetail
