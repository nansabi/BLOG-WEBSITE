import { Box } from "@mui/material"
import Navbar from "../components/Navbar"

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ position: "relative", minHeight: "100vh" }}>
      
      {/* 🌍 BACKGROUND VIDEO */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -2,
        }}
      >
        <source src="/videos/site-bg.mp4" type="video/mp4" />
      </video>

      {/* 🌫 DARK OVERLAY */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.55)",
          zIndex: -1,
        }}
      />

      {/* NAVBAR */}
      <Navbar />

      {/* PAGE CONTENT */}
      <Box sx={{ pt: 8 }}>
        {children}
      </Box>
    </Box>
  )
}

export default MainLayout
