import React, { useState } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  TextField,
  Chip,
  Divider,
} from "@mui/material";
import axios from "axios";
import { URL } from "../utils/constants";

const CompanyJobModal = ({ open, onClose, job, fetchJob }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(job);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
      fetchJob(); // Refresh the job list
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg w-11/12 max-w-2xl">
        <Typography variant="h4" className="mb-4">
          {job.title}
        </Typography>

        {isEditing ? (
          <>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Salary Range"
              name="salaryRange"
              value={formData.salaryRange}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Experience Required"
              name="experienceRequired"
              value={formData.experienceRequired}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Job Type"
              name="jobType"
              value={formData.jobType}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <Button onClick={handleSave} color="primary" variant="contained">
              Save
            </Button>
          </>
        ) : (
          <>
            <Typography variant="body1" className="mb-2">
              {job.description}
            </Typography>
            <Typography variant="body2" className="mb-2">
              <strong>Location:</strong> {job.location}
            </Typography>
            <Typography variant="body2" className="mb-2">
              <strong>Salary Range:</strong> {job.salaryRange}
            </Typography>
            <Typography variant="body2" className="mb-2">
              <strong>Experience Required:</strong> {job.experienceRequired}
            </Typography>
            <Typography variant="body2" className="mb-2">
              <strong>Job Type:</strong> {job.jobType}
            </Typography>
            <Typography variant="body2" className="mb-2">
              <strong>Skills Required:</strong> {job.skillsRequired.join(", ")}
            </Typography>
            <Button
              onClick={() => setIsEditing(true)}
              color="primary"
              variant="contained"
            >
              Edit
            </Button>
          </>
        )}

        <Divider className="my-4" />

        <Typography variant="h6" className="mb-2">
          Dummy Requests
        </Typography>
        <Box className="bg-gray-100 p-3 rounded">
          <Typography variant="body2">Request 1: John Doe</Typography>
          <Typography variant="body2">Request 2: Jane Smith</Typography>
          <Typography variant="body2">Request 3: Alice Johnson</Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default CompanyJobModal;
