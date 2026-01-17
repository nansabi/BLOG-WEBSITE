import { Container, Typography, Grid, Paper, Box } from '@mui/material'
import UserManagement from './UserManagement'
import BlogModeration from './BlogModeration'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'

function AdminDashboard() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f4f7fa 0%, #e9eef3 100%)',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <AdminPanelSettingsIcon
            sx={{
              fontSize: 48,
              color: '#547792',
              mb: 1,
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              letterSpacing: '0.5px',
              color: '#213448',
            }}
          >
            Admin Dashboard
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#5f6f7c',
              mt: 1,
              maxWidth: 520,
              mx: 'auto',
            }}
          >
            Manage users, moderate blogs, and control platform activities
          </Typography>
        </Box>

        {/* Dashboard Cards */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 3,
                background: 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(84, 119, 146, 0.15)',
                boxShadow: '0 16px 40px rgba(33, 52, 72, 0.12)',
                transition: 'all 0.35s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 24px 48px rgba(33, 52, 72, 0.18)',
                },
              }}
            >
              <UserManagement />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 3,
                background: 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(84, 119, 146, 0.15)',
                boxShadow: '0 16px 40px rgba(33, 52, 72, 0.12)',
                transition: 'all 0.35s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 24px 48px rgba(33, 52, 72, 0.18)',
                },
              }}
            >
              <BlogModeration />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default AdminDashboard
