import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Box, CircularProgress } from '@mui/material'

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth()
  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  )
  return token ? children : <Navigate to="/login" />
}

export default ProtectedRoute
