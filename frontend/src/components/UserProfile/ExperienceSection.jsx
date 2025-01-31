import {
  Button,
  Typography,
  Box,
  Paper,
  Stack,
  TextField,
  IconButton,
} from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";

const ExperienceSection = ({
  profile,
  isEditing,
  handleExperienceChange,
  handleAddExperience,
  handleRemoveExperience,
}) => {
  // Helper function to format date to YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <Box flex={1}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={2}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Experience
        </Typography>
        {isEditing && (
          <IconButton color="primary" onClick={handleAddExperience}>
            <AddCircle />
          </IconButton>
        )}
      </Box>
      {isEditing ? (
        profile.experience.map((job, index) => (
          <Box key={index} marginBottom={2}>
            <TextField
              label="Position"
              value={job.position}
              onChange={(e) =>
                handleExperienceChange(index, "position", e.target.value)
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Company"
              value={job.company}
              onChange={(e) =>
                handleExperienceChange(index, "company", e.target.value)
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Start Date"
              type="date"
              value={formatDate(job.startDate)}
              onChange={(e) =>
                handleExperienceChange(index, "startDate", e.target.value)
              }
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="date"
              value={formatDate(job.endDate)}
              onChange={(e) =>
                handleExperienceChange(index, "endDate", e.target.value)
              }
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <span>If experience is still active keep the end date empty</span>
            <TextField
              label="Description"
              value={job.description}
              onChange={(e) =>
                handleExperienceChange(index, "description", e.target.value)
              }
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
            <Button
              color="error"
              startIcon={<RemoveCircle />}
              onClick={() => handleRemoveExperience(index)}
              variant="outlined"
            >
              Remove Experience
            </Button>
          </Box>
        ))
      ) : (
        <Stack direction="column" spacing={2}>
          {profile.experience.length > 0 ? (
            profile.experience.map((job) => (
              <Paper
                key={job._id}
                sx={{ padding: 2, borderRadius: 2, boxShadow: 3 }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {job.position} at {job.company}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {new Date(job.startDate).toLocaleDateString()} -{" "}
                  {job.endDate
                    ? new Date(job.endDate).toLocaleDateString()
                    : "Present"}
                </Typography>
                <Typography variant="body2">{job.description}</Typography>
              </Paper>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">
              No Experience Available
            </Typography>
          )}
        </Stack>
      )}
    </Box>
  );
};

export default ExperienceSection;
