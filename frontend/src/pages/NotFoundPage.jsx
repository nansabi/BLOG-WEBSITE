import { Container, Typography, Button, Box } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

function NotFoundPage() {
  return (
    <Container sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>404 - Page Not Found</Typography>
      <Typography variant="body1" gutterBottom>The page you are looking for does not exist.</Typography>
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" component={RouterLink} to="/">Go Home</Button>
      </Box>
    </Container>
  )
}

export default NotFoundPage
