import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Grid,
  CircularProgress,
  Chip,
  Avatar,
} from "@mui/material";
import axios from "axios";
import { format } from "date-fns";
import { BASE_URL, URL } from "../../utils/constants";
import {
  CheckCircleOutline as AcceptedIcon,
  HourglassEmpty as UnderReviewIcon,
  ThumbUp as ShortlistedIcon,
  Cancel as RejectedIcon,
  Send as AppliedIcon,
} from "@mui/icons-material";

const AppliedJobsSection = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppliedJobs = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("userData"))?.token;
      const userId = JSON.parse(localStorage.getItem("userData"))?.id;

      // Fetch applied jobs for the current user
      const response = await axios.get(`${URL}/applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          userId: userId, // Pass the userId as a query parameter
        },
      });

      setAppliedJobs(response.data);
    } catch (error) {
      setError(error.message || "Failed to fetch applied jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  // Status configuration with icons and colors
  const statusConfig = {
    Applied: {
      icon: <AppliedIcon fontSize="small" />,
      color: "default",
      backgroundColor: "#f0f0f0",
    },
    "Under Review": {
      icon: <UnderReviewIcon fontSize="small" />,
      color: "primary",
      backgroundColor: "#e3f2fd",
    },
    Shortlisted: {
      icon: <ShortlistedIcon fontSize="small" />,
      color: "success",
      backgroundColor: "#e8f5e9",
    },
    Rejected: {
      icon: <RejectedIcon fontSize="small" />,
      color: "error",
      backgroundColor: "#ffebee",
    },
    Accepted: {
      icon: <AcceptedIcon fontSize="small" />,
      color: "secondary",
      backgroundColor: "#f3e5f5",
    },
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" marginTop={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box marginTop={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box marginTop={4} width="100%">
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", mb: 3, color: "#333" }}
      >
        Applied Jobs
      </Typography>
      <Grid container spacing={2}>
        {appliedJobs.length > 0 ? (
          appliedJobs.map((application) => {
            const { icon, color, backgroundColor } =
              statusConfig[application.status] || {};

            return (
              <Grid item xs={12} sm={6} md={4} key={application._id}>
                <Paper
                  sx={{
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: 3,
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                    backgroundColor: "#ffffff",
                    border: "1px solid #e0e0e0",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 1.5,
                      }}
                    >
                      <Avatar
                        src={`${BASE_URL}${application.job?.company?.logo}`}
                        alt={application.job?.company?.name}
                        sx={{ width: 40, height: 40 }}
                      />
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold", color: "#1976d2" }}
                        >
                          {application.job?.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {application.job?.company?.name || "No company"}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1.5,
                      }}
                    >
                      <Chip
                        icon={icon}
                        label={application.status}
                        color={color}
                        variant="outlined"
                        sx={{
                          fontWeight: "bold",
                          backgroundColor,
                          borderColor: color,
                          fontSize: "0.75rem",
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Applied on:</strong>{" "}
                      {format(new Date(application.appliedAt), "MMMM dd, yyyy")}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Job Type:</strong> {application.job?.jobType}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            );
          })
        ) : (
          <Typography variant="body1" color="textSecondary">
            You haven't applied to any jobs yet.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default AppliedJobsSection;
