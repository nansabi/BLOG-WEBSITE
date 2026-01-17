import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Box } from "@mui/material";

import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

import Navbar from "./components/Common/Navbar";
import Footer from "./components/Common/Footer";

import HomePage from "./pages/HomePage";
import BlogDetailPage from "./pages/BlogDetailPage";
import CreateBlogPage from "./pages/CreateBlogPage";
import EditBlogPage from "./pages/EditBlogPage";
import AdminPage from "./pages/AdminPage";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import NotFoundPage from "./pages/NotFoundPage";

/* ------------------ LayoutWrapper ------------------ */
/* Controls Navbar, Footer, and Background Video */
function LayoutWrapper({ children }) {
  const location = useLocation();

  // Routes where Navbar/Footer/Video should be hidden
  const authRoutes = ["/login", "/signup"];
  const isAuthPage = authRoutes.includes(location.pathname);

  return (
    <Box sx={{ minHeight: "100vh", position: "relative" }}>
      {/* Background video ONLY for non-auth pages */}
      {!isAuthPage && (
        <Box
          component="video"
          autoPlay
          loop
          muted
          playsInline
          sx={{
            position: "fixed",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -1,
          }}
        >
          <source src="/Videos/site-bg.mp4" type="video/mp4" />
        </Box>
      )}

      {/* Navbar */}
      {!isAuthPage && <Navbar />}

      {/* Page Content */}
      <Box sx={{ flexGrow: 1 }}>{children}</Box>

      {/* Footer */}
      {!isAuthPage && <Footer />}
    </Box>
  );
}

/* ------------------ App Component ------------------ */
function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <LayoutWrapper>
            <Routes>
              {/* -------- PUBLIC ROUTES -------- */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/blog/:blogId" element={<BlogDetailPage />} />

              {/* -------- PROTECTED ROUTES -------- */}
              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <CreateBlogPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/edit/:blogId"
                element={
                  <ProtectedRoute>
                    <EditBlogPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />

              {/* -------- 404 -------- */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </LayoutWrapper>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
