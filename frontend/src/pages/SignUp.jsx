import React, { useState, useCallback } from "react";
import {
  TextField,
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router"; // Correct import for Link
import * as yup from "yup";
import { ClipLoader } from "react-spinners";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { terror } from "../utils/toasts";
import axios from "axios";
import { URL } from "../utils/constants";

// Yup validation schemas
const userSchema = yup.object().shape({
  userName: yup.string().trim().required("Name is required"),
  userEmail: yup
    .string()
    .trim()
    .email("Invalid email format")
    .required("Email is required"),
  userPhonenb: yup
    .string()
    .trim()
    .matches(/^[0-9]+$/, "Phone number must be numeric")
    .required("Phone number is required"),
  userPassword: yup
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters"),
});

const companySchema = yup.object().shape({
  companyName: yup.string().trim().required("Company name is required"),
  companyEmail: yup
    .string()
    .trim()
    .email("Invalid email format")
    .required("Email is required"),
  companyPhonenb: yup
    .string()
    .trim()
    .matches(/^[0-9]+$/, "Phone number must be numeric")
    .required("Phone number is required"),
  companyPassword: yup
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const SignUp = () => {
  const [tab, setTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhonenb, setUserPhonenb] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhonenb, setCompanyPhonenb] = useState("");
  const [companyPassword, setCompanyPassword] = useState("");
  const navigate = useNavigate();

  const handleTabChange = useCallback((event, newValue) => {
    setTab(newValue);
    setErrors({});
  }, []);

  const handleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, [showPassword]);

  const validate = async () => {
    const schema = tab === 0 ? userSchema : companySchema; // Select the appropriate schema
    const formData =
      tab === 0
        ? {
            userName,
            userEmail,
            userPhonenb,
            userPassword,
          }
        : {
            companyName,
            companyEmail,
            companyPhonenb,
            companyPassword,
          };

    try {
      await schema.validate(formData, {
        abortEarly: false,
      });
      setErrors({});
      return true; // Validation passed
    } catch (validationErrors) {
      const formattedErrors = {};
      validationErrors.inner.forEach((error) => {
        formattedErrors[error.path] = error.message;
      });
      setErrors(formattedErrors);
      return false; // Validation failed
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const isValid = await validate(); // Run validation
    if (!isValid) {
      setLoading(false);
      return; // Stop submission if validation fails
    }

    try {
      const formData =
        tab === 0
          ? {
              name: userName,
              email: userEmail,
              phoneNumber: userPhonenb,
              password: userPassword,
            }
          : {
              name: companyName,
              email: companyEmail,
              phoneNumber: companyPhonenb,
              password: companyPassword,
            };

      // Send data to the server
      await axios.post(
        `${URL}/${tab === 0 ? "users" : "companies"}/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/signin");
    } catch (error) {
      console.error("Sign-up failed:", error);
      terror(error?.response?.data?.error || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 py-8">
      <Box
        className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full"
        component="form"
        noValidate
        onSubmit={handleSubmit}
      >
        <Typography variant="h5" className="font-semibold text-center mb-6">
          Sign Up
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
        {tab === 0 ? (
          <div className="space-y-4">
            <TextField
              label="Name"
              fullWidth
              variant="outlined"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              error={!!errors.userName}
              helperText={errors.userName}
            />
            <TextField
              label="Email"
              fullWidth
              variant="outlined"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              error={!!errors.userEmail}
              helperText={errors.userEmail}
            />
            <TextField
              label="Phone Number"
              fullWidth
              variant="outlined"
              value={userPhonenb}
              onChange={(e) => setUserPhonenb(e.target.value)}
              error={!!errors.userPhonenb}
              helperText={errors.userPhonenb}
            />
            <TextField
              label="Password"
              fullWidth
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              error={!!errors.userPassword}
              helperText={errors.userPassword}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <TextField
              label="Company Name"
              fullWidth
              variant="outlined"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              error={!!errors.companyName}
              helperText={errors.companyName}
            />
            <TextField
              label="Email"
              fullWidth
              variant="outlined"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              error={!!errors.companyEmail}
              helperText={errors.companyEmail}
            />
            <TextField
              label="Phone Number"
              fullWidth
              variant="outlined"
              value={companyPhonenb}
              onChange={(e) => setCompanyPhonenb(e.target.value)}
              error={!!errors.companyPhonenb}
              helperText={errors.companyPhonenb}
            />
            <TextField
              label="Password"
              fullWidth
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={companyPassword}
              onChange={(e) => setCompanyPassword(e.target.value)}
              error={!!errors.companyPassword}
              helperText={errors.companyPassword}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? (
            <ClipLoader size={20} color="#fff" />
          ) : tab === 0 ? (
            "Register as User"
          ) : (
            "Register as Company"
          )}
        </Button>
        <Typography
          variant="body2"
          align="center"
          sx={{ marginTop: 2, color: "grey.600" }}
        >
          Already have an account?{" "}
          <Link to="/signin" className="text-primary text-blue-600">
            Sign In
          </Link>
        </Typography>
      </Box>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
