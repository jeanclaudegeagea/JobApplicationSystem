import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography,
  IconButton,
  Modal,
  Button,
} from "@mui/material";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatDistanceToNow } from "date-fns";
import JobModal from "./JobModal";
import { useState } from "react";
import axios from "axios"; // Assuming you use axios for API calls
import { BASE_URL, URL } from "../utils/constants";
import CompanyJobModal from "./CompanyJobModal";

const JobCard = ({ job, isCompany = false, fetchJob }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleClose = () => {
    setModalOpen(false);
    setCompanyModalOpen(false);
  };

  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent the card's onClick from triggering
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const token = JSON.parse(localStorage.getItem("userData")).token;
    try {
      await axios.delete(`${URL}/jobs/${job._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setDeleteModalOpen(false);
      fetchJob();
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
  };

  return (
    <Card
      key={job._id}
      className="bg-white shadow-md p-4 hover:shadow-lg transition-shadow duration-300 h-fit relative"
      onClick={handleOpen}
    >
      <CardContent>
        {/* Delete Icon */}

        <Box display="flex" alignItems="center" className="mb-3 gap-4">
          <img
            src={`${BASE_URL}${job.company?.logo}`}
            alt={job.company?.name}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center">
              <Typography
                variant="h6"
                className="font-semibold text-red-900 truncate"
              >
                {job.title}
              </Typography>
              {isCompany && (
                <IconButton
                  onClick={handleDeleteClick}
                  className="absolute top-2 right-2"
                  aria-label="delete"
                >
                  <DeleteIcon className="text-red-500" />
                </IconButton>
              )}
            </div>
            <Typography variant="body1" className="ml-3 font-semibold truncate">
              {job.company?.name || "Company"}
            </Typography>
          </div>
        </Box>

        <div className="mb-2 text-gray-600">
          <Typography>
            <LocationOnIcon className="mr-1" />
            {job.location}
          </Typography>
        </div>

        <div className="flex gap-2 my-2">
          <Chip label={job.experienceRequired} color="primary" size="medium" />
          <Chip label={job.jobType} color="success" size="medium" />
        </div>

        <Typography
          variant="body2"
          color="textSecondary"
          className="my-4 text-gray-700 truncate"
        >
          {job.description}
        </Typography>

        <div className="my-3">
          <Divider />
        </div>

        <div className="flex justify-between">
          <Typography className="text-green-600 mt-2">
            {job.salaryRange}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            className="text-gray-500"
          >
            <WatchLaterIcon className="mr-2" />
            Posted{" "}
            {formatDistanceToNow(new Date(job.postedAt), {
              addSuffix: true,
            })}
          </Typography>
        </div>
      </CardContent>

      {isCompany && (
        <CompanyJobModal
          open={modalOpen}
          onClose={handleClose}
          job={job}
          fetchJob={fetchJob}
        />
      )}

      {!isCompany && (
        <JobModal open={modalOpen} onClose={handleClose} id={job._id} />
      )}

      {/* Delete Confirmation Modal */}
      <Modal open={deleteModalOpen} onClose={handleDeleteCancel}>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg">
          <Typography variant="h6" className="mb-4">
            Are you sure you want to delete this job?
          </Typography>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={handleDeleteCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color="error">
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </Card>
  );
};

export default JobCard;
