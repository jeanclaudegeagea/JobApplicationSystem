import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Skeleton,
  Slider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SearchIcon from "@mui/icons-material/Search";
import MapIcon from "@mui/icons-material/Map";
import { useAuth } from "../utils/AuthContext";
import { URL } from "../utils/constants";
import { useMediaQuery, useTheme } from "@mui/material"; // Added
import JobCard from "./JobCard";

const ApplyJob = () => {
  const { isAuth } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({
    title: "",
    location: "",
    jobType: "", // Changed to string, no longer an array
    experienceLevel: "", // Changed to string, no longer an array
  });

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md")); // Check if screen size is small

  const fetchJobs = async () => {
    if (!isAuth) {
      setError("You must be logged in to view jobs.");
      setLoading(false);
      return;
    }

    const token = JSON.parse(localStorage.getItem("userData"))?.token;

    if (!token) {
      setError("Token is missing. Please log in.");
      setLoading(false);
      return;
    }

    const params = {
      title: searchParams.title || "",
      location: searchParams.location || "",
      jobType: searchParams.jobType || "", // Now just a string, no need to join
      // salaryRange: searchParams.salaryRange.join(","),
      experienceLevel: searchParams.experienceLevel || "", // Now just a string, no need to join
    };

    try {
      const response = await axios.get(`${URL}/jobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params,
      });
      setJobs(response.data);
    } catch (err) {
      setError("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    setLoading(true);
    fetchJobs();
  };

  const handleJobTypeChange = (e) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      jobType: e.target.value, // Update jobType directly
    }));
  };

  const handleExperienceLevelChange = (e) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      experienceLevel: e.target.value, // Update experienceLevel directly
    }));
  };

  if (loading) {
    return (
      <div className="p-6">
        {[1, 2, 3].map((key) => (
          <Skeleton
            key={key}
            variant="rectangular"
            height={200}
            className="mb-4 rounded-xl"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20 bg-red-50 p-6 rounded-xl">
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      </div>
    );
  }

  return (
    <div className="px-4 bg-gray-50">
      <Box className="grid grid-cols-1 gap-3 flex-col">
        <Box className="items-center bg-black p-4 rounded-md">
          <div className="mb-4">
            <Typography variant="h4" className="text-white">
              Find Your Dream Job Here <AutoAwesomeIcon className="ml-2" />
            </Typography>
          </div>
          <div className="flex md:flex-row flex-col gap-4 bg-white p-2 rounded-md">
            <TextField
              label="Job title or keyword"
              placeholder="e.g. Software Engineer"
              variant="outlined"
              fullWidth
              className="flex-grow w-5/12"
              slotProps={{
                input: {
                  startAdornment: <SearchIcon className="mr-2 text-gray-500" />,
                },
              }}
              value={searchParams.title}
              name="title"
              onChange={handleSearchChange}
            />
            <TextField
              label="Add country or city"
              placeholder="e.g. United States"
              variant="outlined"
              fullWidth
              className="flex-grow w-5/12"
              slotProps={{
                input: {
                  startAdornment: <MapIcon className="mr-2 text-gray-500" />,
                },
              }}
              value={searchParams.location}
              name="location"
              onChange={handleSearchChange}
            />
            <button
              onClick={handleSearch}
              className="md:w-4/12 w-full bg-blue-600 rounded-md text-white py-3.5"
            >
              <Typography>SEARCH</Typography>
            </button>
          </div>
        </Box>

        <Typography variant="h5">Recommended Jobs</Typography>

        <Box className="flex flex-grow gap-5">
          <Box
            className={`${
              isSmallScreen ? (filterOpen ? "block" : "hidden") : "w-1/4"
            } bg-white p-6 rounded-xl shadow-md transition-all duration-300`}
          >
            <div className="flex justify-between">
              <Typography variant="h6">Filters</Typography>
              <Typography
                className="text-red-500 cursor-pointer"
                onClick={() =>
                  setSearchParams({
                    title: "",
                    location: "",
                    jobType: "",
                    salaryRange: [0, 1000000],
                    experienceLevel: "",
                  })
                }
              >
                Clear all
              </Typography>
            </div>

            {/* Job Type Filter (Radio Buttons) */}
            <div className="mt-2">
              <FormControl component="fieldset">
                <FormLabel component="legend">Job Type</FormLabel>
                <RadioGroup
                  value={searchParams.jobType}
                  onChange={handleJobTypeChange}
                >
                  <FormControlLabel
                    value="Full"
                    control={<Radio />}
                    label="Full Time"
                  />
                  <FormControlLabel
                    value="Part"
                    control={<Radio />}
                    label="Part Time"
                  />
                  <FormControlLabel
                    value="Contract"
                    control={<Radio />}
                    label="Contract"
                  />
                </RadioGroup>
              </FormControl>
            </div>

            {/* Salary Range Filter */}
            {/* <div className="mt-2">
              <Typography>Salary Range</Typography>
              <Slider
                value={searchParams.salaryRange}
                onChange={(e, newValue) =>
                  setSearchParams((prevParams) => ({
                    ...prevParams,
                    salaryRange: newValue,
                  }))
                }
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `$${value}`}
                min={0}
                max={1000000}
              />
            </div> */}

            {/* Experience Level Filter (Radio Buttons) */}
            <div className="mt-2">
              <FormControl component="fieldset">
                <FormLabel component="legend">Experience Level</FormLabel>
                <RadioGroup
                  value={searchParams.experienceLevel}
                  onChange={handleExperienceLevelChange}
                >
                  <FormControlLabel
                    value="Entry"
                    control={<Radio />}
                    label="Entry Level"
                  />
                  <FormControlLabel
                    value="Intermediate"
                    control={<Radio />}
                    label="Intermediate"
                  />
                  <FormControlLabel
                    value="Expert"
                    control={<Radio />}
                    label="Expert"
                  />
                </RadioGroup>
              </FormControl>
            </div>
          </Box>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Check if no jobs are available and display message */}
            {jobs.length === 0 ? (
              <Box className="w-full text-center mt-10">
                <Typography variant="h6" color="textSecondary">
                  No jobs available right now.
                </Typography>
              </Box>
            ) : (
              jobs.map((job) => <JobCard key={job.id} job={job} />)
            )}
          </div>
        </Box>
      </Box>
    </div>
  );
};

export default ApplyJob;
