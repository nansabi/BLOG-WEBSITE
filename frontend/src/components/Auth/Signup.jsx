import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";
import AuthLayout from "./AuthLayout";

export default function Signup() {
  const [name, setName] = useState("");
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
      const data = await authService.signup(name, email, password);

      login(
        {
          _id: data._id,
          name: data.name,
          email: data.email,
        },
        data.token
      );

      navigate("/");
    } catch {
      setError("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout mode="signup">
      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          placeholder="Full Name"
          variant="standard"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          fullWidth
          placeholder="Email"
          variant="standard"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          placeholder="Password"
          type="password"
          variant="standard"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          type="submit"
          sx={{
            mt: 3,
            borderRadius: 5,
            backgroundColor: "#020320ff",
            color: "#fff",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#120855ff" },
          }}
        >
          Sign Up
        </Button>
      </form>

      <Typography align="center" sx={{ mt: 3, color: "#888" }}>
        Already Have An Account ?
      </Typography>

      <Button
        component={Link}
        to="/login"
        fullWidth
        variant="outlined"
        sx={{
          mt: 1,
          borderRadius: 5,
          borderColor: "#443b64ff",
          color: "#231e54ff",
          fontWeight: "bold",
        }}
      >
        Login
      </Button>
    </AuthLayout>
  );
}
