import {
  Button,
  Avatar,
  Typography,
  Box,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import {
  Edit,
  Delete,
  CameraAlt,
  Done,
  Cancel,
  ExitToApp,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { URL } from "../../utils/constants";

const ProfileHeader = ({
  profile,
  isEditing,
  handleEditToggle,
  handleInputChange,
  handleImageUpload,
  handleSubmit,
  handleLogout,
}) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleOpenDeleteModal = () => setOpenDeleteModal(true);
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);

  const handleCancel = () => {
    handleEditToggle();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isEditing) {
        handleCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditing, handleCancel]);

  const handleDeleteAccount = async () => {
    try {
      const localData = JSON.parse(localStorage.getItem("userData"));
      const token = localData.token;

      await axios.delete(`${URL}/companies/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("userData");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting account", error);
    }
  };

  return (
    <Box display="flex" flexDirection="row" alignItems="flex-start" padding={4}>
      {isEditing ? (
        <Box marginRight={4}>
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
                src={profile.logo}
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
          alt={profile.name}
          src={profile.logo ? profile.logo : "/path/to/default-logo.jpg"}
          sx={{ width: 176, height: 176 }}
          className="mr-7"
        />
      )}

      <Box flex={1}>
        <Box display="flex" gap={10} alignItems="center">
          {isEditing ? (
            <TextField
              label="Name"
              value={profile.name || ""}
              onChange={handleInputChange}
              name="name"
              fullWidth
            />
          ) : (
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {profile.name}
            </Typography>
          )}
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              startIcon={isEditing ? <Done /> : <Edit />}
              onClick={isEditing ? handleSubmit : handleEditToggle}
            >
              {isEditing ? "Save" : "Edit"}
            </Button>
            {isEditing && (
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<Cancel />}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            )}
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleOpenDeleteModal}
            >
              Delete
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ExitToApp />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Box>

        <Box marginTop={2}>
          <Typography variant="body1">{profile.email}</Typography>
          <Typography variant="body1">{profile.phoneNumber}</Typography>
          {isEditing ? (
            <>
              <TextField
                label="Location"
                value={profile.location || ""}
                onChange={handleInputChange}
                name="location"
                fullWidth
                margin="normal"
              />
              <TextField
                label="Website"
                value={profile.website || ""}
                onChange={handleInputChange}
                name="website"
                fullWidth
                margin="normal"
              />
              <TextField
                label="Industry"
                value={profile.industry || ""}
                onChange={handleInputChange}
                name="industry"
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                value={profile.description || ""}
                onChange={handleInputChange}
                name="description"
                fullWidth
                multiline
                rows={4}
                margin="normal"
              />
            </>
          ) : (
            <>
              <Typography variant="body1">{profile.location}</Typography>
              <Typography variant="body1">{profile.website}</Typography>
              <Typography variant="body1">{profile.industry}</Typography>
              <Typography variant="body1">{profile.description}</Typography>
            </>
          )}
        </Box>

        <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
          <DialogContent>
            <Typography variant="h6">
              Are you sure you want to delete your account?
            </Typography>
            <Typography variant="body2" color="textSecondary">
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteModal} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteAccount} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ProfileHeader;
