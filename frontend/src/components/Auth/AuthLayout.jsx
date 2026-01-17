import { Box, Paper, Avatar, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

export default function AuthLayout({ children, mode }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#dedfedff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: 360,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {/* Gradient Header */}
        <Box
          sx={{
            height: 140,
            background: "linear-gradient(135deg, #281652ff, #ba279aff)",
            position: "relative",
          }}
        />

        {/* Avatar */}
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: "#fff",
            position: "absolute",
            top: "calc(50% - 210px)",
            left: "50%",
            transform: "translateX(-50%)",
            boxShadow: 3,
          }}
        >
          <PersonIcon sx={{ fontSize: 40, color: "#9060d0ff" }} />
        </Avatar>

        {/* Content */}
        <Box sx={{ p: 4, pt: 6 }}>
          <Typography
            align="center"
            sx={{
              mb: 3,
              fontWeight: 600,
              color: "#444",
            }}
          >
            {mode === "login" ? "Login to your account" : "Create your account"}
          </Typography>

          {children}
        </Box>
      </Paper>
    </Box>
  );
}
