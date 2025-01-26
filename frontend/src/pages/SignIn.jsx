import React, { useState, useCallback } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
  Tab,
  Tabs,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import { Link } from "react-router"; // Correct import for Link
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { URL } from "../utils/constants";
import * as yup from "yup";
import { ClipLoader } from "react-spinners";
import { ToastContainer } from "react-toastify";
import { terror } from "../utils/toasts";
import { useAuth } from "../utils/AuthContext"; // Import useAuth hook

// Validation schema with yup
const validationSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const SignIn = () => {
  const [tab, setTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth(); // Get setAuth function from context

  const handleTabChange = useCallback((event, newValue) => {
    setTab(newValue);
    setErrors({});
  }, []);

  const handleClickShowPassword = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  const validate = () => {
    const validationErrors = {};
    try {
      validationSchema.validateSync({ email, password }, { abortEarly: false });
    } catch (error) {
      error.inner.forEach((err) => {
        validationErrors[err.path] = err.message;
      });
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Validate form fields
      if (!validate()) return;

      setLoading(true);
      try {
        // Example: send request to your API
        const { data } = await axios.post(
          `${URL}/${tab === 0 ? "users" : "companies"}/login`,
          {
            email,
            password,
          }
        ); // Replace with actual API endpoint

        console.log(data);
        setEmail("");
        setPassword("");
        setAuth(true);
        localStorage.setItem("userData", JSON.stringify(data));
      } catch (error) {
        console.error("Sign-in failed:", error);
        terror(error?.response?.data?.error || "Error");
      } finally {
        setLoading(false);
      }
    },
    [email, password]
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "grey.100",
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 400,
          padding: 4,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          fontWeight="bold"
          sx={{ marginBottom: 3 }}
        >
          Sign In
        </Typography>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="fullWidth"
          className="mb-6"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="User" icon={<PersonIcon />} iconPosition="start" />
          <Tab label="Company" icon={<BusinessIcon />} iconPosition="start" />
        </Tabs>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            fullWidth
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Handling input changes for email
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            fullWidth
            required
            type={showPassword ? "text" : "password"} // Toggle between text and password
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Handling input changes for password
            error={!!errors.password}
            helperText={errors.password}
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{ textTransform: "none", fontSize: "1rem", mt: 1 }}
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color={"#ffffff"} /> : "Sign In"}
          </Button>
        </Box>
        <Typography
          variant="body2"
          align="center"
          sx={{ marginTop: 2, color: "grey.600" }}
        >
          Don’t have an account?{" "}
          <Link to="/signup" style={{ color: "#0073b1" }}>
            Sign up
          </Link>
        </Typography>
      </Paper>
      <ToastContainer />
    </Box>
  );
};

export default SignIn;
