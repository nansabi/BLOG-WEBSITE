import { Card, CardContent, CardMedia, Typography, Box, Button, Chip, Avatar, Stack } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { formatDate, truncateText, stripHtml } from '../../utils/formatters'

function BlogCard({ blog }) {
  const imageUrl = blog.image ? blog.image : '/placeholder-image.png'

  const categoryColors = {
    Technology: { bg: '#e8f5e9', color: '#2e7d32' },
    Food: { bg: '#fff3e0', color: '#e65100' },
    Automobile: { bg: '#ffebee', color: '#c62828' },
    Lifestyle: { bg: '#f3e5f5', color: '#6a1b9a' },
    Travel: { bg: '#e0f2f1', color: '#00695c' },
    Business: { bg: '#e3f2fd', color: '#1565c0' },
  }

  const catStyle = categoryColors[blog.category] || { bg: '#f5f5f5', color: '#616161' }

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2.5,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        border: '1px solid #f0f0f0',
        overflow: 'hidden',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: '#ffffff',
        '&:hover': {
          transform: 'translateY(-12px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
          borderColor: '#e0e0e0',
        },
      }}
    >
      {/* Image Container */}
      {imageUrl && (
        <Box
          sx={{
            position: 'relative',
            height: 200,
            overflow: 'hidden',
            backgroundColor: '#f5f5f5',
          }}
        >
          <CardMedia
            component="img"
            height="200"
            image={imageUrl}
            alt={blog.title}
            sx={{
              objectFit: 'cover',
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              height: '100%',
              '&:hover': {
                transform: 'scale(1.08)',
              },
            }}
          />
          {/* Category Badge */}
          {blog.category && (
            <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
              <Chip
                label={blog.category}
                size="small"
                sx={{
                  backgroundColor: catStyle.bg,
                  color: catStyle.color,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  border: `1.5px solid ${catStyle.color}`,
                }}
              />
            </Box>
          )}
        </Box>
      )}

      <CardContent sx={{ flexGrow: 1, p: 3, pb: 2 }}>
        {/* Title */}
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontFamily: "'Poppins', 'Segoe UI', sans-serif",
            fontWeight: 700,
            fontSize: '1.15rem',
            lineHeight: 1.4,
            color: '#1a1a1a',
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            '&:hover': {
              color: '#667eea',
            },
            transition: 'color 0.3s',
          }}
        >
          {blog.title}
        </Typography>

        {/* Content Preview */}
        <Typography
          variant="body2"
          sx={{
            mb: 3,
            color: '#666',
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontSize: '0.95rem',
          }}
        >
          {truncateText(stripHtml(blog.content), 100)}
        </Typography>

        {/* Author Info */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            display: 'flex',
            alignItems: 'center',
            pt: 2,
            borderTop: '1px solid #f0f0f0',
          }}
        >
          <Avatar
            src={blog.authorAvatar || '/placeholder-avatar.png'}
            alt={blog.author}
            sx={{
              width: 32,
              height: 32,
              border: '2px solid #f0f0f0',
            }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="caption"
              sx={{
                color: '#333',
                fontWeight: 600,
                display: 'block',
                fontSize: '0.85rem',
              }}
            >
              {blog.author}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#999',
                display: 'block',
                fontSize: '0.8rem',
              }}
            >
              {formatDate(blog.createdAt)}
            </Typography>
          </Box>
        </Stack>
      </CardContent>

      {/* Read More Button */}
      <Box sx={{ p: 3, pt: 0 }}>
        <Button
          fullWidth
          variant="outlined"
          component={RouterLink}
          to={`/blog/${blog.blogId}`}
          endIcon={<ArrowForwardIcon />}
          sx={{
            borderColor: '#667eea',
            color: '#667eea',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 2,
            py: 1.2,
            transition: 'all 0.3s',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              transition: 'left 0.3s',
              zIndex: -1,
            },
            '&:hover': {
              borderColor: '#764ba2',
              color: '#fff',
              transform: 'translateX(2px)',
              boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
              '&::before': {
                left: 0,
              },
            },
          }}
        >
          Read More
        </Button>
      </Box>
    </Card>
  )
}

export default BlogCard