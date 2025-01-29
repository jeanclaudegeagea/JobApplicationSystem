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

const EducationSection = ({
  profile,
  isEditing,
  handleUniversityChange,
  handleAddUniversity,
  handleRemoveUniversity,
}) => {
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
          Education
        </Typography>
        {isEditing && (
          <IconButton color="primary" onClick={handleAddUniversity}>
            <AddCircle />
          </IconButton>
        )}
      </Box>
      {isEditing ? (
        profile.university.map((education, index) => (
          <Box key={index} marginBottom={2}>
            <TextField
              label="Degree"
              value={education.degree}
              onChange={(e) =>
                handleUniversityChange(index, "degree", e.target.value)
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Major"
              value={education.major}
              onChange={(e) =>
                handleUniversityChange(index, "major", e.target.value)
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="University"
              value={education.universityName}
              onChange={(e) =>
                handleUniversityChange(index, "universityName", e.target.value)
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Start Date"
              type="date"
              value={formatDate(education.startDate)}
              onChange={(e) =>
                handleUniversityChange(index, "startDate", e.target.value)
              }
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="date"
              value={formatDate(education.endDate)}
              onChange={(e) =>
                handleUniversityChange(index, "endDate", e.target.value)
              }
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <Button
              color="error"
              startIcon={<RemoveCircle />}
              onClick={() => handleRemoveUniversity(index)}
              variant="outlined"
            >
              Remove Education
            </Button>
          </Box>
        ))
      ) : (
        <Stack direction="column" spacing={2}>
          {profile.university && profile.university.length > 0 ? (
            profile.university.map((education) => (
              <Paper
                key={education._id}
                sx={{ padding: 2, borderRadius: 2, boxShadow: 3 }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {education.degree} in {education.major} at{" "}
                  {education.universityName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {new Date(education.startDate).toLocaleDateString()} -{" "}
                  {new Date(education.endDate).toLocaleDateString()}
                </Typography>
              </Paper>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">
              No Education Available
            </Typography>
          )}
        </Stack>
      )}
    </Box>
  );
};

export default EducationSection;
