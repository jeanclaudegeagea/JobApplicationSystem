import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  TextField,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  IconButton,
  Avatar,
} from "@mui/material";
import axios from "axios";
import { BASE_URL, URL } from "../utils/constants";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import DescriptionIcon from "@mui/icons-material/Description";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarIcon from "@mui/icons-material/CalendarMonth";
import DoneIcon from "@mui/icons-material/Done";
import { useNavigate } from "react-router";

const CompanyJobModal = ({ open, onClose, job, fetchJob }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(job);
  const [newSkill, setNewSkill] = useState("");
  const [applications, setApplications] = useState([]);
  const [applicationStates, setApplicationStates] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (open && job?._id) {
      fetchApplications();
    }
  }, [open, job?._id]);

  const fetchApplications = async () => {
    const token = JSON.parse(localStorage.getItem("userData")).token;
    try {
      const response = await axios.get(`${URL}/applications`, {
        params: {
          jobId: job._id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skillsRequired.includes(newSkill)) {
      setFormData({
        ...formData,
        skillsRequired: [...formData.skillsRequired, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData({
      ...formData,
      skillsRequired: formData.skillsRequired.filter((s) => s !== skill),
    });
  };

  const handleSave = async () => {
    const token = JSON.parse(localStorage.getItem("userData")).token;
    try {
      await axios.put(`${URL}/jobs/${job._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setIsEditing(false);
      fetchJob();
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/searchedUser/${userId}`);
  };

  const handleSaveApplicationChanges = async (applicationId) => {
    const token = JSON.parse(localStorage.getItem("userData")).token;
    const { feedback, status } = applicationStates[applicationId];

    try {
      await axios.put(
        `${URL}/applications/${applicationId}`,
        { companyFeedback: feedback, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchApplications(); // Refresh the applications list
    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  const handleFeedbackChange = (applicationId, value) => {
    setApplicationStates((prev) => ({
      ...prev,
      [applicationId]: {
        ...prev[applicationId],
        feedback: value,
      },
    }));
  };

  const handleStatusChange = (applicationId, value) => {
    setApplicationStates((prev) => ({
      ...prev,
      [applicationId]: {
        ...prev[applicationId],
        status: value,
      },
    }));
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg w-11/12 max-w-2xl"
        sx={{
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <div></div>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {isEditing ? (
          <>
            <Box sx={{ mb: 3 }}>
              <div className="flex justify-between">
                <IconButton
                  onClick={() => setIsEditing(false)}
                  color="secondary"
                  variant="outlined"
                  sx={{ mb: 1 }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <IconButton
                  onClick={handleSave}
                  color="primary"
                  variant="contained"
                  sx={{ mb: 1 }}
                >
                  <DoneIcon />
                </IconButton>
              </div>
              <TextField
                label="Job Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Box>

            <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth>
                  <InputLabel id="experience-required-label">
                    Experience Required
                  </InputLabel>
                  <Select
                    labelId="experience-required-label"
                    name="experienceRequired"
                    value={formData.experienceRequired}
                    onChange={handleInputChange}
                    label="Experience Required"
                  >
                    <MenuItem value="Entry Level">Entry Level</MenuItem>
                    <MenuItem value="Intermediate">Intermediate</MenuItem>
                    <MenuItem value="Expert">Expert</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth>
                  <InputLabel id="job-type-label">Job Type</InputLabel>
                  <Select
                    labelId="job-type-label"
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleInputChange}
                    label="Job Type"
                  >
                    <MenuItem value="Full-Time">Full-Time</MenuItem>
                    <MenuItem value="Part-Time">Part-Time</MenuItem>
                    <MenuItem value="Contract">Contract</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  label="Salary"
                  name="salaryRange"
                  value={formData.salaryRange}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <TextField
                  label="Closing Date"
                  name="closingDate"
                  type="date"
                  value={formData.closingDate}
                  onChange={handleInputChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Box>

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
                {formData.skillsRequired.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={() => handleRemoveSkill(skill)}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                label="Job Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={4}
                fullWidth
                required
              />
            </Box>
          </>
        ) : (
          <>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Box display="flex" alignItems="center">
                <Avatar
                  src={`${BASE_URL}${job.company.logo}`}
                  alt={job.company.name}
                  sx={{ width: 56, height: 56, mr: 2 }}
                />
                <Typography variant="h5">{job.title}</Typography>
              </Box>
              <IconButton onClick={() => setIsEditing(true)} color="primary">
                <EditIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
              <Box sx={{ flex: 1, display: "flex" }}>
                <LocationOnIcon sx={{ mr: 1 }} />
                <Typography variant="body2" className="flex flex-col">
                  <strong>Location:</strong> {job.location}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, display: "flex" }}>
                <WorkIcon sx={{ mr: 1 }} />
                <Typography variant="body2" className="flex flex-col">
                  <strong>Experience Required:</strong>
                  {job.experienceRequired}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, display: "flex" }}>
                <SchoolIcon sx={{ mr: 1 }} />
                <Typography variant="body2" className="flex flex-col">
                  <strong>Job Type:</strong> {job.jobType}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
              <Box sx={{ flex: 1, display: "flex" }}>
                <AttachMoneyIcon sx={{ mr: 1 }} />
                <Typography variant="body2" className="flex flex-col">
                  <strong>Salary Range:</strong> {job.salaryRange}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, display: "flex" }}>
                <CalendarIcon sx={{ mr: 1 }} />
                <Typography variant="body2" className="flex flex-col">
                  <strong>Closing Date:</strong> {job.closingDate.split("T")[0]}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 3 }}>
              <div className="mb-2">
                <WorkIcon sx={{ mr: 1 }} />
                <strong>Skills Required:</strong>
              </div>
              {job.skillsRequired.map((skill, index) => (
                <Chip key={index} label={skill} sx={{ mr: 1, mb: 1 }} />
              ))}
            </Box>
            <Box sx={{ mb: 3, display: "flex" }}>
              <DescriptionIcon sx={{ mr: 1 }} />
              <Typography variant="body1" className="flex flex-col">
                <strong>Description:</strong> {job.description}
              </Typography>
            </Box>
          </>
        )}

        <Divider className="my-4" />

        <Typography variant="h6" className="mb-2">
          Applications
        </Typography>
        <Box className="bg-gray-100 p-3 rounded">
          {applications.length > 0 ? (
            applications.map((application) => (
              <Box
                key={application._id}
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleUserClick(application.user._id)}
                >
                  <Avatar
                    src={`${BASE_URL}${application.user.profilePicture}`}
                    alt={application.user.name}
                    sx={{ width: 40, height: 40, mr: 2 }}
                  />
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {application.user.name}
                  </Typography>
                </Box>
                <Typography variant="body2">
                  <strong>Email:</strong> {application.user.email}
                </Typography>
                <Typography variant="body2">
                  <strong>Phone:</strong> {application.user.phoneNumber}
                </Typography>
                <Typography variant="body2">
                  <strong>Status:</strong> {application.status}
                </Typography>
                <Typography variant="body2">
                  <strong>Applied On:</strong>{" "}
                  {new Date(application.appliedAt).toLocaleDateString()}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <TextField
                    label="Feedback"
                    value={applicationStates[application._id]?.feedback || ""}
                    onChange={(e) =>
                      handleFeedbackChange(application._id, e.target.value)
                    }
                    fullWidth
                    multiline
                    rows={2}
                  />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                      labelId="status-label"
                      value={
                        applicationStates[application._id]?.status || "Applied"
                      }
                      onChange={(e) =>
                        handleStatusChange(application._id, e.target.value)
                      }
                      label="Status"
                    >
                      <MenuItem value="Applied">Applied</MenuItem>
                      <MenuItem value="Under Review">Under Review</MenuItem>
                      <MenuItem value="Shortlisted">Shortlisted</MenuItem>
                      <MenuItem value="Rejected">Rejected</MenuItem>
                      <MenuItem value="Accepted">Accepted</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      handleSaveApplicationChanges(application._id)
                    }
                  >
                    Save Changes
                  </Button>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body2">No applications found.</Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default CompanyJobModal;
