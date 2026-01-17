import { Box, Container, Typography } from '@mui/material'

function Footer() {
  return (
    <Box sx={{ bgcolor: '#f5f5f5', py: 4, mt: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="textSecondary" align="center">
          © 2024 BlogPlatform. All rights reserved.
        </Typography>
      </Container>
    </Box>
  )
}

export default Footer
