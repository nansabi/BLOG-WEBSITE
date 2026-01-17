// ============================================
// FILE 2: CommentForm.jsx
// ============================================

import { useState } from 'react'
import { Box, TextField, Button, IconButton, Collapse, Paper } from '@mui/material'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import SendIcon from '@mui/icons-material/Send'
import EmojiPicker from 'emoji-picker-react'
import { commentService } from '../../services/commentService'

function CommentForm({ blogId, onCommentAdded }) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    
    setLoading(true)
    try {
      await commentService.createComment(blogId, text)
      setText('')
      setShowEmoji(false)
      setIsFocused(false)
      if (onCommentAdded) onCommentAdded()
    } catch (err) {
      console.error('Failed to post comment:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper
      elevation={isFocused ? 3 : 0}
      sx={{
        mb: 4,
        p: 3,
        borderRadius: 3,
        border: isFocused ? '2px solid #2f3792ff' : '2px solid #e0e0e0',
        transition: 'all 0.3s ease',
        background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)'
      }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          placeholder="Share your thoughts..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => !text && setIsFocused(false)}
          fullWidth
          multiline
          rows={isFocused ? 4 : 2}
          variant="outlined"
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              borderRadius: 2,
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              '& fieldset': {
                borderColor: 'transparent'
              },
              '&:hover fieldset': {
                borderColor: 'transparent'
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent'
              }
            }
          }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <IconButton 
            onClick={() => setShowEmoji(!showEmoji)}
            sx={{
              color: showEmoji ? '#454490ff' : '#666',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(222, 128, 43, 0.1)',
                color: '#34215dff',
                transform: 'scale(1.1)'
              }
            }}
          >
            <EmojiEmotionsIcon />
          </IconButton>

          <Button
            type="submit"
            variant="contained"
            disabled={loading || !text.trim()}
            endIcon={<SendIcon />}
            sx={{
              textTransform: 'none',
              borderRadius: 2.5,
              px: 4,
              py: 1.2,
              fontWeight: 600,
              fontSize: '0.95rem',
              background: 'linear-gradient(135deg, #7a7eb0ff 0%, #36256aff 100%)',
              boxShadow: '0 4px 14px rgba(222, 128, 43, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #425e97ff 0%, #7f1265ff 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(222, 128, 43, 0.5)'
              },
              '&:disabled': {
                background: '#e0e0e0',
                color: '#999',
                boxShadow: 'none'
              }
            }}
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </Button>
        </Box>

        <Collapse in={showEmoji}>
          <Box 
            sx={{ 
              mt: 2,
              display: 'flex',
              justifyContent: 'center',
              '& .epr-main': {
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
              }
            }}
          >
            <EmojiPicker 
              onEmojiClick={handleEmojiClick}
              width="100%"
              height={350}
            />
          </Box>
        </Collapse>
      </Box>
    </Paper>
  )
}

export default CommentForm