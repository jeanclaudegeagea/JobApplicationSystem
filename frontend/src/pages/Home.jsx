import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
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

const Home = () => {
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
  const jobTypes = ["Full time", "Part time", "Internship", "Project work", "Volunteering"];
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
        (!filters.experienceLevels.length || filters.experienceLevels.includes(job.experienceLevel)) &&
        parseInt(job.salary) >= filters.minSalary &&
        parseInt(job.salary) <= filters.maxSalary
    );

    // Sorting logic
    switch (sortBy) {
      case "recent":
        return processedJobs.sort(
          (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
        );
      case "salary":
        return processedJobs.sort((a, b) => parseInt(b.salary) - parseInt(a.salary));
      default:
        return processedJobs;
    }
  }, [jobs, filters, sortBy]);

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
    <div className="py-16 px-6 lg:px-24 bg-gray-50">
      <Box className="flex flex-wrap gap-10">
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
                  onChange={() => handleCheckboxChange("experienceLevels", level)}
                />
                <ListItemText primary={level} />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Main Content */}
        <Box className="flex-grow">
          {/* Search and Sort */}
          <Box className="mb-10 flex flex-wrap gap-4 items-center">
            <TextField
              label="Search by job title or skills"
              variant="outlined"
              fullWidth
              value={filters.searchTerm}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
              }
              className="flex-grow max-w-xl"
              InputProps={{
                startAdornment: <SearchIcon className="mr-2 text-gray-500" />,
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredAndSortedJobs.length > 0 ? (
              filteredAndSortedJobs.map((job) => (
                <Card
                  key={job._id}
                  className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300"
                  onClick={() => (window.location.href = `/job/${job._id}`)}
                >
                  <CardContent>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box display="flex" alignItems="center">
                        {job.company?.logo && (
                          <img
                            src={job.company.logo}
                            alt={job.company.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        )}
                        <Typography
                          variant="body1"
                          className="font-semibold ml-3 text-gray-800"
                        >
                          {job.company
                            ? job.company.name
                            : "Company not specified"}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        className="text-gray-500 text-sm"
                      >
                        {formatDistanceToNow(new Date(job.postedAt), {
                          addSuffix: true,
                        })}
                      </Typography>
                    </Box>

                    <Typography
                      variant="h5"
                      className="font-semibold text-gray-800 mt-4 text-lg sm:text-xl"
                    >
                      {job.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      className="mt-1 text-gray-600"
                    >
                      {job.location}
                    </Typography>

                    <Typography
                      variant="body2"
                      className="mt-3 text-gray-700 text-sm md:text-base"
                    >
                      {job.description.length > 120
                        ? job.description.slice(0, 120) + "..."
                        : job.description}
                    </Typography>

                    {job.salary && (
                      <Box className="mt-4">
                        <Typography
                          variant="body1"
                          className="font-medium text-gray-900"
                        >
                          Salary: <span className="text-green-600">{job.salary}</span>
                        </Typography>
                      </Box>
                    )}

                    <Box className="flex flex-wrap gap-2 mt-4">
                      {job.skillsRequired.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          color="primary"
                          size="small"
                        />
                      ))}
                    </Box>

                    <Divider className="my-4" />

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        variant="body2"
                        className="text-gray-600 text-sm"
                      >
                        Closing: {new Date(job.closingDate).toLocaleDateString()}
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-sm text-gray-500"
                      >
                        {formatDistanceToNow(new Date(job.closingDate), {
                          addSuffix: true,
                        })}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography
                variant="body1"
                className="col-span-full text-center text-gray-500"
              >
                No jobs match your current filters
              </Typography>
            )}
          </div>

          {filteredAndSortedJobs.length > 0 && (
            <Box className="mt-6 text-center">
              <Typography variant="body2" color="textSecondary">
                Showing {filteredAndSortedJobs.length} of {jobs.length} jobs
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Home;
