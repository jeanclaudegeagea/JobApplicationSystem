import React, { useState } from "react";
import * as yup from "yup";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { URL } from "../utils/constants";
import { useAuth } from "../utils/AuthContext";
import { terror } from "../utils/toasts";

const CreateJob = () => {
  const {
    userData: { company, token },
  } = useAuth();

  const today = new Date();
  const formattedDate =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

  const [jobDetails, setJobDetails] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    salaryRange: "",
    skillsRequired: "",
    experienceRequired: "",
    jobType: "Full-Time",
    closingDate: formattedDate,
  });

  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({});

  // Validation schema using Yup
  const validationSchema = yup.object().shape({
    title: yup.string().required("Job Title is required"),
    company: yup.string().required("Company is required"),
    location: yup.string().required("Location is required"),
    description: yup.string().required("Job Description is required"),
    salaryRange: yup
      .string()
      .matches(/^\$\d{1,3}(,\d{3})*(\.\d{2})?$/, "Invalid Salary Range"),
    skillsRequired: yup
      .string()
      .matches(/^([a-zA-Z]+,?\s*)+$/, "Invalid Skills Required"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobDetails({ ...jobDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    // Skip validation for salaryRange and skillsRequired if they're empty
    const jobDetailsToValidate = { ...jobDetails };

    if (!jobDetailsToValidate.salaryRange.trim()) {
      delete jobDetailsToValidate.salaryRange;
    }

    if (!jobDetailsToValidate.skillsRequired.trim()) {
      delete jobDetailsToValidate.skillsRequired;
    }

    try {
      await validationSchema.validate(jobDetailsToValidate, {
        abortEarly: false,
      });

      await axios.post(
        `${URL}/jobs/create`,
        {
          ...jobDetails,
          company: company._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Replace console log with API call to save the job details
      setErrors({}); // Clear any previous errors on successful validation
      setJobDetails({
        title: "",
        description: "",
        company: "",
        location: "",
        salaryRange: "",
        skillsRequired: "",
        experienceRequired: "",
        jobType: "Full-Time",
        closingDate: formattedDate,
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        const errorMessages = {};
        error.inner.forEach((err) => {
          errorMessages[err.path] = err.message;
        });
        setErrors(errorMessages); // Set error messages
      }
      terror(error?.response?.data?.error || "Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "800px",
        mx: "auto",
        p: 3,
        backgroundColor: "white",
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
        Create Job
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Fill in the details below to post a job opening.
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={5}>
          {/* Job Title */}
          <Grid xs={12}>
            <TextField
              label="Job Title"
              name="title"
              value={jobDetails.title}
              onChange={handleChange}
              fullWidth
              error={!!errors.title} // Show error if present
              helperText={errors.title} // Display error message
            />
          </Grid>

          {/* Company */}
          <Grid xs={12}>
            <TextField
              label="Company"
              name="company"
              value={jobDetails.company}
              onChange={handleChange}
              fullWidth
              error={!!errors.company}
              helperText={errors.company}
            />
          </Grid>

          {/* Location */}
          <Grid xs={12} sm={6}>
            <TextField
              label="Location"
              name="location"
              value={jobDetails.location}
              onChange={handleChange}
              fullWidth
              error={!!errors.location}
              helperText={errors.location}
            />
          </Grid>

          {/* Experience Required */}
          <Grid xs={12} sm={6}>
            <TextField
              label="Experience Required"
              name="experienceRequired"
              value={jobDetails.experienceRequired}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          {/* Salary Range */}
          <Grid xs={12} sm={6}>
            <TextField
              label="Salary Range"
              name="salaryRange"
              value={jobDetails.salaryRange}
              onChange={handleChange}
              fullWidth
              error={!!errors.salaryRange}
              helperText={errors.salaryRange}
            />
          </Grid>

          {/* Skills Required */}
          <Grid xs={12}>
            <TextField
              label="Skills Required"
              name="skillsRequired"
              value={jobDetails.skillsRequired}
              onChange={handleChange}
              fullWidth
              error={!!errors.skillsRequired}
              helperText={errors.skillsRequired}
            />
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              gap: "2rem",
            }}
          >
            {/* Job Type */}
            <FormControl fullWidth>
              <InputLabel id="job-type-label">Job Type</InputLabel>
              <Select
                labelId="job-type-label"
                name="jobType"
                value={jobDetails.jobType}
                onChange={handleChange}
              >
                <MenuItem value="Full-Time">Full-Time</MenuItem>
                <MenuItem value="Part-Time">Part-Time</MenuItem>
                <MenuItem value="Contract">Contract</MenuItem>
              </Select>
            </FormControl>

            {/* Closing Date */}
            <TextField
              label="Closing Date"
              name="closingDate"
              type="date"
              inputlabelprops={{
                shrink: true,
              }}
              value={jobDetails.closingDate}
              onChange={handleChange}
              fullWidth
            />
          </Box>

          {/* Job Description */}
          <TextField
            label="Job Description"
            name="description"
            value={jobDetails.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            error={!!errors.description}
            helperText={errors.description}
          />

          {/* Submit Button */}
          <Grid
            xs={12}
            sx={{
              marginLeft: "auto",
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                fontWeight: "bold",
                py: 1.5,
                textTransform: "none",
              }}
            >
              {isLoading ? (
                <ClipLoader size={20} color={"#ffffff"} />
              ) : (
                "Post Job"
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default CreateJob;
