import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Divider,
  Avatar,
  Chip,
  Link,
  IconButton,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WorkIcon from "@mui/icons-material/Work";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { URL } from "../utils/constants";
import { terror, tsuccess } from "../utils/toasts";
import { useAuth } from "../utils/AuthContext";

const JobModal = ({ open, onClose, id }) => {
  const formatDate = (date) => new Date(date).toLocaleDateString();
  const [job, setJob] = useState({});
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState(false);
  const [hasApplied, setHasApplied] = useState(false); // State to track if the user has applied
  const token = JSON.parse(localStorage.getItem("userData"))?.token;
  const { setIsSessionExpiredOpen } = useAuth();

  const fetchJob = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("userData"))?.id;
      const response = await axios.get(`${URL}/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setJob(response.data);

      // Check if the user has already applied to the job
      const applicationResponse = await axios.get(`${URL}/applications/check`, {
        params: {
          jobId: id,
          user: userId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (applicationResponse.data.hasApplied) {
        setHasApplied(true);
      }
    } catch (error) {
      console.error("Error fetching job details", error);

      if (error["response"]["data"]["error"] === "Session expired") {
        setIsSessionExpiredOpen(true);
      } else terror(error["response"]["data"]["error"] || "Error");
    }
  };

  const handleApply = async () => {
    setIsApplying(true);
    try {
      const userId = JSON.parse(localStorage.getItem("userData"))?.id;
      const response = await axios.post(
        `${URL}/applications`,
        {
          job: id,
          user: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setApplySuccess(true);
        setHasApplied(true); // Set hasApplied to true after successful application
        tsuccess("Application submitted successfully!");
      }
    } catch (error) {
      console.error("Error applying to job", error);
      setApplyError(true);
      terror(error["response"]["data"]["error"] || "Error applying to job");
    } finally {
      setIsApplying(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchJob();
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="job-modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 1000,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          overflowY: "auto",
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation(); // Prevent event propagation
            onClose();
          }}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "text.secondary",
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Header Section */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          {/* Company Logo */}
          {job.company?.logo ? (
            <Avatar
              alt={job.company?.name || "Company Logo"}
              src={job.company?.logo}
              sx={{ width: 60, height: 60, mr: 2 }}
            />
          ) : (
            <Avatar
              sx={{ width: 60, height: 60, mr: 2, backgroundColor: "gray" }}
            />
          )}
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {job.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {job.location}
            </Typography>
          </Box>
        </Box>

        {/* Job Description */}
        <Typography variant="body1" className="my-2" paragraph>
          <strong>Description:</strong> {job.description}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Job Details Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" fontWeight="500" gutterBottom>
              Salary & Experience
            </Typography>
            <Typography
              variant="body2"
              className="my-2"
              display="flex"
              alignItems="center"
            >
              <AttachMoneyIcon sx={{ marginRight: 1 }} />
              {job.salaryRange || "N/A"}
            </Typography>
            <Typography
              variant="body2"
              className="my-2"
              display="flex"
              alignItems="center"
            >
              <WorkIcon sx={{ marginRight: 1 }} />
              {job.jobType || "N/A"}
            </Typography>
            <Typography variant="body2" className="my-2">
              <strong>Experience Required:</strong>{" "}
              {job.experienceRequired || "N/A"}
            </Typography>
            <Typography variant="body2" className="my-2">
              <strong>Closing Date:</strong>{" "}
              {formatDate(job.closingDate) || "N/A"}
            </Typography>
            <Typography variant="body2" className="my-2">
              <strong>Posted On:</strong> {formatDate(job.postedAt) || "N/A"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="h6" fontWeight="500" gutterBottom>
              Company Details
            </Typography>
            {job.company && (
              <>
                <Typography variant="body2" className="my-2">
                  <strong>Company Name:</strong> {job.company.name || "N/A"}
                </Typography>
                <Typography variant="body2" className="my-2">
                  <strong>Industry:</strong>{" "}
                  {job.company.industry || "Not specified"}
                </Typography>
                <Typography variant="body2" className="my-2">
                  <strong>Company Email:</strong>{" "}
                  {job.company.email || "Not provided"}
                </Typography>
                <Typography variant="body2" className="my-2">
                  <strong>Company Phone:</strong>{" "}
                  {job.company.phoneNumber || "Not provided"}
                </Typography>
                <Typography variant="body2" className="my-2">
                  <strong>Company Location:</strong>{" "}
                  {job.company.location || "Not provided"}
                </Typography>
                <Typography variant="body2" className="my-2">
                  <strong>Company Website:</strong>{" "}
                  {job.company.website ? (
                    <Link
                      href={job.company.website}
                      target="_blank"
                      color="primary"
                    >
                      {job.company.website}
                    </Link>
                  ) : (
                    "Not provided"
                  )}
                </Typography>
                <Typography variant="body2" className="my-2">
                  <strong>Company Description:</strong>{" "}
                  {job.company.description || "No description provided"}
                </Typography>
              </>
            )}
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Job Skills Section (Skills as Chips) */}
        <Typography variant="h6" fontWeight="500" gutterBottom>
          Skills Required
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {job.skillsRequired?.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              sx={{ margin: 0.5 }}
              variant="outlined"
            />
          ))}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Footer with Apply Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleApply}
            disabled={isApplying || applySuccess || hasApplied} // Disable if already applied
            sx={{
              padding: "10px 20px",
              fontWeight: 600,
              boxShadow: "0px 6px 15px rgba(0,0,0,0.1)",
              "&:hover": {
                boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
                transform: "translateY(-2px)",
              },
            }}
          >
            {isApplying ? (
              <CircularProgress size={24} color="inherit" />
            ) : applySuccess || hasApplied ? (
              "Applied"
            ) : (
              "Easy Apply"
            )}
          </Button>
        </Box>

        {/* Snackbar for success/error messages */}
        <Snackbar
          open={applySuccess || applyError}
          autoHideDuration={6000}
          onClose={() => {
            setApplySuccess(false);
            setApplyError(false);
          }}
          message={
            applySuccess
              ? "Application submitted successfully!"
              : "Error applying to job"
          }
        />
      </Box>
    </Modal>
  );
};

export default JobModal;
