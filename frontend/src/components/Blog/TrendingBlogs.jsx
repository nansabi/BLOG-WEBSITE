import { useState, useEffect } from 'react'
import {
  Grid,
  Container,
  Typography,
  Box,
  Button,
  Stack,
} from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import BlogCard from './BlogCard'
import { blogService } from '../../services/blogService'
import Loading from '../Common/Loading'

function TrendingBlogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(8) // better multiple of 4

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await blogService.getTrendingBlogs()
        setBlogs(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchTrending()
  }, [])

  if (loading) return <Loading />

  const visibleBlogs = blogs.slice(0, visibleCount)
  const hasMore = visibleCount < blogs.length

  return (
    <Box
      sx={{
        py: 8,
        background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
            <TrendingUpIcon sx={{ color: '#667eea', fontSize: '2rem' }} />
            <Typography
              variant="h4"
              sx={{
                fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Trending Blogs
            </Typography>
          </Stack>

          <Typography
            variant="body1"
            sx={{
              color: '#666',
              fontSize: '1.05rem',
              maxWidth: 500,
              mx: 'auto',
            }}
          >
            Discover the most popular stories and insights from our community
          </Typography>
        </Box>

        {/* Blogs Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {visibleBlogs.map((blog) => (
            <Grid
              item
              key={blog.blogId}
              xs={12}   // mobile → 1 card
              sm={6}    // tablet → 2 cards
              md={3}    // ✅ desktop → 4 cards
            >
              <BlogCard blog={blog} />
            </Grid>
          ))}
        </Grid>

        {/* Load More Button */}
        {hasMore && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => setVisibleCount((prev) => prev + 8)}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                px: 4,
                py: 1.5,
                borderRadius: 2.5,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 16px 32px rgba(102, 126, 234, 0.4)',
                },
              }}
            >
              Load More Blogs
            </Button>
          </Box>
        )}

        {/* Empty State */}
        {blogs.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 8, color: '#999' }}>
            <Typography variant="h6">No blogs available yet</Typography>
            <Typography variant="body2">
              Start creating your first blog today!
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default TrendingBlogs
