import { useState, useEffect } from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { commentService } from '../../services/commentService'
import { formatDate } from '../../utils/formatters'
import Loading from '../Common/Loading'

function CommentList({ blogId }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComments()
  }, [blogId])

  const fetchComments = async () => {
    setLoading(true)
    try {
      const data = await commentService.getComments(blogId)
      setComments(data)
    } catch (err) {
      console.error('Failed to fetch comments:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />
  if (comments.length === 0) return <Typography>No comments yet.</Typography>

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Comments</Typography>
      {comments.map((comment) => (
        <Paper key={comment._id} sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2">{comment.userName}</Typography>
          <Typography variant="body2" color="textSecondary">{formatDate(comment.createdAt)}</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>{comment.text}</Typography>
        </Paper>
      ))}
    </Box>
  )
}

export default CommentList
