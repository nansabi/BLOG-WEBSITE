import { useState, useEffect } from 'react'
import { 
  Grid, Container, Box, TextField, MenuItem, Pagination,
  InputAdornment, Select, FormControl, InputLabel, Chip
} from '@mui/material'
import { Search as SearchIcon, SortByAlpha as SortIcon } from '@mui/icons-material'
import BlogCard from './BlogCard'
import Loading from '../Common/Loading'
import { blogService } from '../../services/blogService'

function BlogList() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')

  useEffect(() => { fetchBlogs() }, [page, search, sort])

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const data = await blogService.getBlogs(page, 6, search, sort)
      setBlogs(data.blogs)
      setTotalPages(data.totalPages)
    } catch (err) { 
      console.error(err) 
    } finally { 
      setLoading(false) 
    }
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleSortChange = (e) => {
    setSort(e.target.value)
    setPage(1)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header Section */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
              Discover Stories
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#666', margin: '8px 0 0 0' }}>
              Explore insightful articles and perspectives
            </p>
          </Box>
          {search && (
            <Chip 
              label={`Results for "${search}"`}
              onDelete={() => {
                setSearch('')
                setPage(1)
              }}
              color="primary"
              variant="outlined"
            />
          )}
        </Box>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <TextField
            placeholder="Search articles..."
            value={search}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            sx={{ flex: 1, minWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#999' }} />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sort}
              onChange={handleSortChange}
              label="Sort by"
              size="small"
              startAdornment={<SortIcon sx={{ mr: 1 }} />}
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
              <MenuItem value="title">Title (A-Z)</MenuItem>
              <MenuItem value="title_desc">Title (Z-A)</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Blog Grid */}
      {loading ? (
        <Loading />
      ) : blogs.length > 0 ? (
        <>
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {blogs.map(blog => (
              <Grid item xs={12} sm={6} lg={4} key={blog.blogId}>
                <BlogCard blog={blog} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={(e, v) => setPage(v)}
              size="large"
              shape="rounded"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontSize: '0.95rem',
                  fontWeight: 500,
                }
              }}
            />
          </Box>
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <p style={{ fontSize: '1.1rem', color: '#999' }}>
            No articles found. Try adjusting your search.
          </p>
        </Box>
      )}
    </Container>
  )
}

export default BlogList