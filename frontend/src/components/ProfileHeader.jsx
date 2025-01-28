import {
  Button,
  Avatar,
  Typography,
  Box,
  Stack,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import { Edit, Delete, CameraAlt, Done } from "@mui/icons-material";
import { useState } from "react";

const ProfileHeader = ({
  profile,
  isEditing,
  handleEditToggle,
  handleInputChange,
  handleImageUpload,
  handleCvUpload,
  handleSubmit,
}) => {
  const [openCvModal, setOpenCvModal] = useState(false);

  const handleOpenCvModal = () => setOpenCvModal(true);
  const handleCloseCvModal = () => setOpenCvModal(false);

  return (
    <div className="flex justify-center items-center">
      {isEditing ? (
        <Box className="mr-10">
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="profile-picture-upload"
            type="file"
            onChange={handleImageUpload}
          />
          <label htmlFor="profile-picture-upload">
            <Box position="relative">
              <Avatar
                alt={profile.name}
                src={profile.profilePicture}
                sx={{ width: 176, height: 176, cursor: "pointer" }}
              />
              <CameraAlt
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  borderRadius: "50%",
                  padding: 1,
                  width: 50,
                  height: 50,
                  cursor: "pointer",
                }}
              />
            </Box>
          </label>
        </Box>
      ) : (
        <Avatar
          alt={`http://localhost:5000${profile.name}`}
          src={
            profile.profilePicture
              ? profile.profilePicture
              : "/path/to/default-profile.jpg"
          }
          sx={{ width: 176, height: 176 }}
          className="mr-7"
        />
      )}

      <div>
        <div className="flex gap-10">
          {isEditing ? (
            <TextField
              label="Name"
              value={profile.name || ""}
              onChange={handleInputChange}
              name="name"
              fullWidth
            />
          ) : (
            <Typography variant="h4" sx={{ fontWeight: "bold", marginTop: 2 }}>
              {profile.name}
            </Typography>
          )}
          <Box marginTop={2} className="flex gap-2">
            <Button
              className="w-full"
              variant="contained"
              startIcon={isEditing ? <Done /> : <Edit />}
              onClick={isEditing ? handleSubmit : handleEditToggle}
            >
              {isEditing ? "Save" : "Edit"}
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              className="w-full"
            >
              Delete
            </Button>
          </Box>
        </div>

        <Stack direction="row" spacing={4} sx={{ marginTop: 2 }}>
          <Box textAlign="center" className="flex items-center gap-2">
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              150
            </Typography>
            <Typography variant="body2">Posts</Typography>
          </Box>
          <Box textAlign="center" className="flex items-center gap-2">
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              300
            </Typography>
            <Typography variant="body2">Followers</Typography>
          </Box>
          <Box textAlign="center" className="flex items-center gap-2">
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              180
            </Typography>
            <Typography variant="body2">Following</Typography>
          </Box>
        </Stack>

        <div className="flex flex-col gap-2 mt-2">
          <Typography variant="body1">{profile.email}</Typography>
          <Typography variant="body1">{profile.phoneNumber}</Typography>
          {isEditing ? (
            <TextField
              label="Location"
              value={profile.location || ""}
              onChange={handleInputChange}
              name="location"
              fullWidth
            />
          ) : (
            <Typography variant="body1">{profile.location}</Typography>
          )}
        </div>

        {isEditing && (
          <Box marginTop={2}>
            <input
              accept="application/pdf"
              style={{ display: "none" }}
              id="cv-upload"
              type="file"
              onChange={handleCvUpload}
            />
            <label htmlFor="cv-upload">
              <Button variant="outlined" component="span">
                Upload CV
              </Button>
            </label>
          </Box>
        )}

        {profile.cv && !isEditing && (
          <Box marginTop={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleOpenCvModal}
            >
              View CV
            </Button>
          </Box>
        )}

        <Dialog
          open={openCvModal}
          onClose={handleCloseCvModal}
          fullWidth
          maxWidth="md"
        >
          <DialogContent>
            <iframe
              src={`http://localhost:5000${profile.cv}`}
              width="100%"
              height="700px"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCvModal} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default ProfileHeader;
