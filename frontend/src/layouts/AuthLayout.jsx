import { Box, Container } from "@mui/material"

const AuthLayout = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff7e6, #fff)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xs">
        {children}
      </Container>
    </Box>
  )
}

export default AuthLayout
