import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Alert,
  Box,
} from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";
import AuthLayout from "./AuthLayout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await authService.login(email, password);

      login(
        {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
        },
        data.token
      );

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout mode="login">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* EMAIL */}
        <TextField
          fullWidth
          placeholder="Email"
          type="email"
          variant="standard"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* PASSWORD */}
        <TextField
          fullWidth
          placeholder="Password"
          type="password"
          variant="standard"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />



        {/* LOGIN BUTTON */}
        <Button
          fullWidth
          type="submit"
          disabled={loading}
          sx={{
            mt: 2,
            borderRadius: 5,
            backgroundColor: "#0b0436ff",
            color: "#fff",
            fontWeight: "bold",
            py: 1.1,
            "&:hover": { backgroundColor: "#1c114aff" },
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      {/* SIGNUP LINK */}
      <Typography align="center" sx={{ mt: 3, color: "#888" }}>
        Don’t Have An Account ?
      </Typography>

      <Button
        component={Link}
        to="/signup"
        fullWidth
        variant="outlined"
        sx={{
          mt: 1,
          borderRadius: 5,
          borderColor: "#201a76ff",
          color: "#1c0f52ff",
          fontWeight: "bold",
          py: 1,
          "&:hover": {
            borderColor: "#0d065dff",
            color: "#2e1058ff",
          },
        }}
      >
        Signup
      </Button>
    </AuthLayout>
  );
}
