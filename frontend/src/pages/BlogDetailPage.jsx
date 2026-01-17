import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import BlogDetail from '../components/Blog/BlogDetail'
import CommentList from '../components/Comments/CommentList'
import CommentForm from '../components/Comments/CommentForm'
import { Container, Box, Divider, Paper, useTheme, useMediaQuery } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import IconButton from '@mui/material/IconButton'

function BlogDetailPage() {
  const { blogId } = useParams()
  const navigate = useNavigate()
  const [commentRefresh, setCommentRefresh] = useState(0)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleCommentAdded = () => {
    setCommentRefresh(prev => prev + 1)
  }

  return (
    <Box sx={{ 
      background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.mode === 'dark' ? '#1a1a2e' : '#f5f7fa'} 100%)`,
      minHeight: '100vh',
      py: { xs: 2, sm: 4, md: 6 }
    }}>
      <Container maxWidth="md">
        {/* Back Button */}
        <Box sx={{ mb: 4 }}>
          <IconButton 
            onClick={() => navigate(-1)}
            sx={{ 
              color: 'primary.main',
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateX(-4px)',
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>

        {/* Blog Content */}
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 3, sm: 4, md: 5 },
            mb: 6,
            borderRadius: 2,
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            transition: 'box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
                : '0 8px 32px rgba(0, 0, 0, 0.08)'
            }
          }}
        >
          <BlogDetail blogId={blogId} />
        </Paper>

        {/* Comments Section */}
        <Box>
          {/* Comment Form */}
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 3, sm: 4 },
              mb: 4,
              borderRadius: 2,
              background: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.02)' 
                : 'rgba(0, 0, 0, 0.02)',
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Box 
                component="h2" 
                sx={{ 
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  fontWeight: 600,
                  m: 0,
                  color: theme.palette.text.primary
                }}
              >
                Share Your ThoughtS
              </Box>
            </Box>
            <CommentForm blogId={blogId} onCommentAdded={handleCommentAdded} />
          </Paper>

          <Divider sx={{ my: 5 }} />

          {/* Comments List */}
          <Box>
            <Box 
              component="h2" 
              sx={{ 
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                fontWeight: 600,
                mb: 3,
                color: theme.palette.text.primary
              }}
            >
              Comments
            </Box>
            <CommentList key={commentRefresh} blogId={blogId} />
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default BlogDetailPage