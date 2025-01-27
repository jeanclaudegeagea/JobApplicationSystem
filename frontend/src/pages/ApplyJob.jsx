import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Skeleton,
  Slider,
  List,
  ListItem,
  ListItemText,
  Checkbox,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "../utils/AuthContext";
import { URL } from "../utils/constants";
import { formatDistanceToNow } from "date-fns";
import { mockJobs } from "../utils/dummy";

const ApplyJob = () => {
  const { isAuth } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Advanced filtering state
  const [filters, setFilters] = useState({
    searchTerm: "",
    minSalary: 50000,
    maxSalary: 120000,
    jobTypes: [],
    experienceLevels: [],
  });

  // Sorting state
  const [sortBy, setSortBy] = useState("recent");

  // Job types and experience levels for filters
  const jobTypes = [
    "Full time",
    "Part time",
    "Internship",
    "Project work",
    "Volunteering",
  ];
  const experienceLevels = ["Entry level", "Intermediate", "Expert"];

  const handleCheckboxChange = (filterType, value) => {
    setFilters((prev) => {
      const updatedFilter = prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value];
      return { ...prev, [filterType]: updatedFilter };
    });
  };

  // Memoized and filtered jobs
  const filteredAndSortedJobs = useMemo(() => {
    let processedJobs = jobs.filter(
      (job) =>
        (filters.searchTerm === "" ||
          job.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) &&
        (!filters.jobTypes.length || filters.jobTypes.includes(job.jobType)) &&
        (!filters.experienceLevels.length ||
          filters.experienceLevels.includes(job.experienceLevel)) &&
        parseInt(job.salary) >= filters.minSalary &&
        parseInt(job.salary) <= filters.maxSalary
    );

    // Sorting logic
    switch (sortBy) {
      case "recent":
        return processedJobs.sort(
          (a, b) =>
            new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
        );
      case "salary":
        return processedJobs.sort(
          (a, b) => parseInt(b.salary) - parseInt(a.salary)
        );
      default:
        return processedJobs;
    }
  }, [jobs, filters, sortBy]);

  const filteredJobs = useMemo(() => {
    let jobs = mockJobs.filter((job) =>
      job.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
    );

    switch (filters.sortBy) {
      case "recent":
        return jobs.sort(
          (a, b) => new Date(b.postedDate) - new Date(a.postedDate)
        );
      case "price":
        return jobs.sort(
          (a, b) =>
            parseFloat(b.price.replace(/\$/g, "")) -
            parseFloat(a.price.replace(/\$/g, ""))
        );
      default:
        return jobs;
    }
  }, [filters]);

  useEffect(() => {
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

      try {
        const response = await axios.get(`${URL}/jobs`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setJobs(response.data);
      } catch (err) {
        setError("Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [isAuth]);

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
    <div className="px-4  bg-gray-50">
      <Box className="flex gap-3 flex-col">
        {/* Search and Sort */}
        <Box className=" flex justify-center  gap-4 items-center">
          <TextField
            label="Search by job title or skills"
            variant="outlined"
            fullWidth
            value={filters.searchTerm}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
            }
            className="flex-grow max-w-xl"
            slotProps={{
              input: {
                startAdornment: <SearchIcon className="mr-2 text-gray-500" />,
              },
            }}
          />

          <FormControl variant="outlined" className="min-w-[120px]">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="recent">Most Recent</MenuItem>
              <MenuItem value="salary">Highest Salary</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            className="h-14"
          >
            Advanced Filters
          </Button>
        </Box>

        {/* Main Content */}
        <Box className="flex flex-grow gap-5">
          {/* Sidebar */}
          <Box className="w-full lg:w-1/4 bg-white p-6 rounded-xl shadow-md">
            <Typography variant="h6" className="font-semibold mb-4">
              Filters
            </Typography>

            {/* Job Types */}
            <Typography variant="body1" className="font-medium mb-2">
              Job Type
            </Typography>
            <List>
              {jobTypes.map((type) => (
                <ListItem key={type} disablePadding>
                  <Checkbox
                    checked={filters.jobTypes.includes(type)}
                    onChange={() => handleCheckboxChange("jobTypes", type)}
                  />
                  <ListItemText primary={type} />
                </ListItem>
              ))}
            </List>

            {/* Salary Range */}
            <Typography variant="body1" className="font-medium mt-6 mb-2">
              Salary Range
            </Typography>
            <Slider
              value={[filters.minSalary, filters.maxSalary]}
              onChange={(e, newValue) =>
                setFilters((prev) => ({
                  ...prev,
                  minSalary: newValue[0],
                  maxSalary: newValue[1],
                }))
              }
              valueLabelDisplay="auto"
              min={50000}
              max={120000}
            />

            {/* Experience Levels */}
            <Typography variant="body1" className="font-medium mt-6 mb-2">
              Experience Level
            </Typography>
            <List>
              {experienceLevels.map((level) => (
                <ListItem key={level} disablePadding>
                  <Checkbox
                    checked={filters.experienceLevels.includes(level)}
                    onChange={() =>
                      handleCheckboxChange("experienceLevels", level)
                    }
                  />
                  <ListItemText primary={level} />
                </ListItem>
              ))}
            </List>
          </Box>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent>
                  <Box display="flex" alignItems="center" className="mb-4">
                    <img
                      src={job.logo}
                      alt={job.companyName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <Typography variant="h6" className="ml-3 font-semibold">
                      {job.companyName}
                    </Typography>
                  </Box>

                  <Typography
                    variant="h5"
                    className="font-semibold text-gray-800 mb-2"
                  >
                    {job.title}
                  </Typography>

                  <Box className="flex flex-wrap gap-2 mb-2">
                    <Chip
                      label={job.experienceLevel}
                      color="primary"
                      size="small"
                    />
                    <Chip label={job.jobType} color="success" size="small" />
                  </Box>

                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className="mb-4 text-gray-700"
                  >
                    {job.description}
                  </Typography>

                  <Typography
                    variant="h6"
                    className="font-semibold text-green-600"
                  >
                    {job.price}
                  </Typography>

                  <Divider className="my-4" />

                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className="text-gray-500"
                  >
                    Posted{" "}
                    {formatDistanceToNow(new Date(job.postedDate), {
                      addSuffix: true,
                    })}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </Box>
      </Box>
    </div>
  );
};

export default ApplyJob;
