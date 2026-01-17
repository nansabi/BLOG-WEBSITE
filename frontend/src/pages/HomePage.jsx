import BlogList from '../components/Blog/BlogList'
import TrendingBlogs from '../components/Blog/TrendingBlogs'
import { Container, Grid, Typography } from '@mui/material'

function HomePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <TrendingBlogs />

      <Typography variant="h4" gutterBottom sx={{ mt: 6 }}>All Blogs</Typography>
      <BlogList />
    </Container>
  )
}

export default HomePage
