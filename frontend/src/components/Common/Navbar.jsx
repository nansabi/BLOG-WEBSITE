import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Container,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import HomeIcon from '@mui/icons-material/Home'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import NotificationBell from '../Notifications/NotificationBell'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open)
  }

  const links = user
    ? [
        { text: 'Create Article', to: '/create' },
        { text: 'Dashboard', to: '/admin' },
      ]
    : [
        { text: 'Login', to: '/login' },
        { text: 'Register', to: '/signup' },
      ]

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={1}
        sx={{ 
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar 
            disableGutters 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              py: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              
              {/* Home Icon */}
              <IconButton
                component={RouterLink}
                to="/"
                sx={{
                  color: '#ffffff',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#a8d5ff',
                    backgroundColor: 'rgba(168, 213, 255, 0.12)',
                  },
                }}
              >
                <HomeIcon />
              </IconButton>

              {/* Brand Logo */}
              <Typography
                variant="h6"
                component={RouterLink}
                to="/"
                sx={{
                  textDecoration: 'none',
                  color: '#fff',
                  fontWeight: 700,
                  fontFamily: "'Inter', 'Segoe UI', sans-serif",
                  fontSize: 20,
                  letterSpacing: '0.5px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#a8d5ff',
                  },
                }}
              >
                BlogHex
              </Typography>

              <Box
                sx={{
                  width: 1,
                  height: 24,
                  background: 'linear-gradient(90deg, #a8d5ff, #7fb3f0)',
                  borderRadius: '2px',
                }}
              />
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, alignItems: 'center' }}>
              {links.map((link) => (
                <Button
                  key={link.text}
                  component={RouterLink}
                  to={link.to}
                  sx={{
                    color: '#e0e0e0',
                    fontWeight: 500,
                    fontSize: 14,
                    textTransform: 'none',
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: '0.3px',
                    position: 'relative',
                    transition: 'color 0.3s ease',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -2,
                      left: 0,
                      width: 0,
                      height: '2px',
                      background: '#a8d5ff',
                      transition: 'width 0.3s ease',
                    },
                    '&:hover': {
                      color: '#a8d5ff',
                      backgroundColor: 'transparent',
                      '&::after': {
                        width: '100%',
                      },
                    },
                  }}
                >
                  {link.text}
                </Button>
              ))}

              {user && <NotificationBell />}

              {user && (
                <>
                  <Divider 
                    orientation="vertical" 
                    flexItem 
                    sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} 
                  />
                  <Typography
                    variant="body2"
                    sx={{ 
                      color: '#e0e0e0',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      fontWeight: 500,
                      minWidth: 'fit-content',
                    }}
                  >
                    {user.name}
                  </Typography>
                  <Button
                    onClick={handleLogout}
                    sx={{
                      color: '#e0e0e0',
                      fontWeight: 500,
                      fontSize: 14,
                      textTransform: 'none',
                      fontFamily: "'Inter', sans-serif",
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: '#ff6b6b',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                      },
                    }}
                  >
                    Logout
                  </Button>
                </>
              )}
            </Box>

            {/* Mobile Hamburger */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton 
                onClick={toggleDrawer(true)}
                sx={{ color: '#fff' }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer 
        anchor="right" 
        open={drawerOpen} 
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: '#f8f9fa',
          },
        }}
      >
        <Box 
          sx={{ 
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }} 
          role="presentation"
        >
          <Box 
            sx={{ 
              p: 2, 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: '#1a1a2e',
                fontSize: 18,
              }}
            >
              Menu
            </Typography>
            <IconButton 
              onClick={toggleDrawer(false)}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <List sx={{ flex: 1, pt: 1 }}>
            {links.map((link) => (
              <ListItem key={link.text} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={link.to}
                  onClick={toggleDrawer(false)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    color: '#333',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      backgroundColor: '#e8f4f8',
                      color: '#1a1a2e',
                      borderLeft: '3px solid #a8d5ff',
                      pl: 'calc(2rem - 3px)',
                    },
                  }}
                >
                  <ListItemText primary={link.text} />
                </ListItemButton>
              </ListItem>
            ))}
            {user && (
              <>
                <Divider sx={{ my: 1 }} />
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      handleLogout()
                      setDrawerOpen(false)
                    }}
                    sx={{
                      py: 1.5,
                      px: 2,
                      color: '#ff6b6b',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 14,
                      fontWeight: 500,
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        backgroundColor: 'rgba(255, 107, 107, 0.08)',
                      },
                    }}
                  >
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  )
}

export default Navbar
