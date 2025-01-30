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
  Container,
  CircularProgress,
  Chip,
  Stack,
} from "@mui/material";
import axios from "axios";
import { URL } from "../utils/constants";
import { useAuth } from "../utils/AuthContext";
import { terror } from "../utils/toasts";

const CreateJob = () => {
  const [jobDetails, setJobDetails] = useState({
    title: "",
    description: "",
    location: "",
    salaryRange: "",
    skillsRequired: [], // Array for skills
    experienceRequired: "Entry Level", // Default experience level
    jobType: "Full-Time", // Default job type
    closingDate: "", // Closing date for the job
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [newSkill, setNewSkill] = useState(""); // Temporary state for adding skills

  // Validation schema using Yup
  const validationSchema = yup.object().shape({
    title: yup.string().required("Job Title is required"),
    location: yup.string().required("Location is required"),
    description: yup.string().required("Job Description is required"),
    salaryRange: yup.string().required("Salary is required"),
    closingDate: yup.date(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobDetails({ ...jobDetails, [name]: value });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !jobDetails.skillsRequired.includes(newSkill)) {
      setJobDetails({
        ...jobDetails,
        skillsRequired: [...jobDetails.skillsRequired, newSkill.trim()],
      });
      setNewSkill(""); // Clear the input after adding
    }
  };

  const handleRemoveSkill = (skill) => {
    setJobDetails({
      ...jobDetails,
      skillsRequired: jobDetails.skillsRequired.filter((s) => s !== skill),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData.token;

    try {
      await validationSchema.validate(jobDetails, { abortEarly: false });

      await axios.post(
        `${URL}/jobs/create`,
        { ...jobDetails, company: userData.company._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Reset form on successful submission
      setErrors({});
      setJobDetails({
        title: "",
        description: "",
        location: "",
        salaryRange: "",
        skillsRequired: [],
        experienceRequired: "Entry Level",
        jobType: "Full-Time",
        closingDate: "",
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        const errorMessages = {};
        error.inner.forEach((err) => {
          errorMessages[err.path] = err.message;
        });
        setErrors(errorMessages);
      } else {
        terror(error.response?.data?.error || "An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          p: 4,
          backgroundColor: "background.paper",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          Create Job
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Fill in the details below to post a job opening.
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Job Title */}
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Job Title"
              name="title"
              value={jobDetails.title}
              onChange={handleChange}
              fullWidth
              error={!!errors.title}
              helperText={errors.title}
              required
            />
          </Box>

          {/* Location, Experience Required, and Job Type */}
          <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
            {/* Location */}
            <Box sx={{ flex: 1 }}>
              <TextField
                label="Location"
                name="location"
                value={jobDetails.location}
                onChange={handleChange}
                fullWidth
                error={!!errors.location}
                helperText={errors.location}
                required
              />
            </Box>

            {/* Experience Required */}
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="experience-required-label">
                  Experience Required
                </InputLabel>
                <Select
                  labelId="experience-required-label"
                  name="experienceRequired"
                  value={jobDetails.experienceRequired}
                  onChange={handleChange}
                  label="Experience Required"
                >
                  <MenuItem value="Entry Level">Entry Level</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Expert">Expert</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Job Type */}
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="job-type-label">Job Type</InputLabel>
                <Select
                  labelId="job-type-label"
                  name="jobType"
                  value={jobDetails.jobType}
                  onChange={handleChange}
                  label="Job Type"
                >
                  <MenuItem value="Full-Time">Full-Time</MenuItem>
                  <MenuItem value="Part-Time">Part-Time</MenuItem>
                  <MenuItem value="Contract">Contract</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Salary Range and Closing Date */}
          <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
            {/* Salary Range */}
            <Box sx={{ flex: 1 }}>
              <TextField
                label="Salary"
                name="salaryRange"
                value={jobDetails.salaryRange}
                onChange={handleChange}
                fullWidth
                error={!!errors.salaryRange}
                helperText={errors.salaryRange}
                required
              />
            </Box>

            {/* Closing Date */}
            <Box sx={{ flex: 1 }}>
              <TextField
                label="Closing Date"
                name="closingDate"
                type="date"
                value={jobDetails.closingDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.closingDate}
                helperText={errors.closingDate}
              />
            </Box>
          </Box>

          {/* Skills Required */}
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                label="Add Skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={handleAddSkill}
                sx={{ height: "56px" }}
              >
                +
              </Button>
            </Stack>
            <Box sx={{ mt: 2 }}>
              {jobDetails.skillsRequired.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => handleRemoveSkill(skill)}
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
          </Box>

          {/* Job Description */}
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Job Description"
              name="description"
              value={jobDetails.description}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
              error={!!errors.description}
              helperText={errors.description}
              required
            />
          </Box>

          {/* Submit Button */}
          <Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
              sx={{ py: 1.5, fontWeight: "bold" }}
            >
              {isLoading ? <CircularProgress size={24} /> : "Post Job"}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default CreateJob;
