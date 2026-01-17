import { Box, CircularProgress } from '@mui/material'

function Loading() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
      }}
    >
      <CircularProgress />
    </Box>
  )
}

export default Loading
