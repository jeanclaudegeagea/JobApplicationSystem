import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography,
} from "@mui/material";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { formatDistanceToNow } from "date-fns";
import JobModal from "./JobModal";
import { useState } from "react";

const JobCard = ({ job }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleOpen = () => {
    setModalOpen(true);
  };

  return (
    <Card
      key={job._id}
      className="bg-white shadow-md p-4 hover:shadow-lg transition-shadow duration-300 h-fit"
      onClick={handleOpen}
    >
      <CardContent>
        <Box display="flex" alignItems="center" className="mb-3 gap-4">
          <img
            src={job.company?.logo}
            alt={job.company?.name}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <Typography
              variant="h6"
              className="font-semibold text-red-900 truncate"
            >
              {job.title}
            </Typography>
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

      <JobModal open={modalOpen} onClose={handleClose} id={job._id} />
    </Card>
  );
};

export default JobCard;
