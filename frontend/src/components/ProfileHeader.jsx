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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
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
import axios from "axios";
import { BASE_URL, URL } from "../utils/constants";

const ProfileHeader = ({
  profile,
  isEditing,
  handleEditToggle,
  handleInputChange,
  handleImageUpload,
  handleCvUpload,
  handleSubmit,
  handleLogout,
}) => {
  const [openCvModal, setOpenCvModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openFollowersModal, setOpenFollowersModal] = useState(false);
  const [openFollowingsModal, setOpenFollowingsModal] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);

  const handleOpenDeleteModal = () => setOpenDeleteModal(true);
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);

  const handleOpenCvModal = () => setOpenCvModal(true);
  const handleCloseCvModal = () => setOpenCvModal(false);

  const handleOpenFollowersModal = () => setOpenFollowersModal(true);
  const handleCloseFollowersModal = () => setOpenFollowersModal(false);

  const handleOpenFollowingsModal = () => setOpenFollowingsModal(true);
  const handleCloseFollowingsModal = () => setOpenFollowingsModal(false);

  const fetchFollowers = async () => {
    try {
      const localData = JSON.parse(localStorage.getItem("userData"));
      const token = localData.token;

      const response = await axios.get(`${URL}/connections/get/followers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFollowers(response.data);
    } catch (error) {
      console.error("Error fetching followers", error);
    }
  };

  const fetchFollowings = async () => {
    try {
      const localData = JSON.parse(localStorage.getItem("userData"));
      const token = localData.token;

      const response = await axios.get(`${URL}/connections/get/followings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFollowings(response.data);
    } catch (error) {
      console.error("Error fetching followings", error);
    }
  };

  const handleCancel = () => {
    handleEditToggle();
  };

  useEffect(() => {
    fetchFollowers();
    fetchFollowings();
  }, []);

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

      await axios.delete(`${URL}/users/profile`, {
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
          alt={profile.name}
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
            {isEditing && (
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<Cancel />}
                className="w-full"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            )}
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              className="w-full"
              onClick={handleOpenDeleteModal}
            >
              Delete
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ExitToApp />}
              className="w-full"
              onClick={handleLogout}
            >
              Logout
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
              {followers.length}
            </Typography>
            <Button
              onClick={() => {
                handleOpenFollowersModal();
                fetchFollowers();
              }}
            >
              <Typography variant="body2">Followers</Typography>
            </Button>
          </Box>
          <Box textAlign="center" className="flex items-center gap-2">
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {followings.length}
            </Typography>
            <Button
              onClick={() => {
                handleOpenFollowingsModal();
                fetchFollowings();
              }}
            >
              <Typography variant="body2">Following</Typography>
            </Button>
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

        <Dialog
          open={openCvModal}
          onClose={handleCloseCvModal}
          fullWidth
          maxWidth="md"
        >
          <DialogContent>
            <iframe
              src={`${BASE_URL}${profile.cv}`}
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

        <Dialog open={openFollowersModal} onClose={handleCloseFollowersModal}>
          <DialogContent>
            <Typography variant="h6">Followers</Typography>
            <List>
              {followers.length > 0 ? (
                followers.map((follower) => (
                  <ListItem key={follower.id}>
                    <ListItemAvatar>
                      <Avatar src={follower.profilePicture} />
                    </ListItemAvatar>
                    <ListItemText primary={follower.name} />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body1" sx={{ textAlign: "center" }}>
                  No followers
                </Typography>
              )}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseFollowersModal} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openFollowingsModal} onClose={handleCloseFollowingsModal}>
          <DialogContent>
            <Typography variant="h6">Following</Typography>
            <List>
              {followings.length > 0 ? (
                followings.map((following) => (
                  <ListItem key={following.id}>
                    <ListItemAvatar>
                      <Avatar src={following.profilePicture} />
                    </ListItemAvatar>
                    <ListItemText primary={following.name} />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body1" sx={{ textAlign: "center" }}>
                  No followings
                </Typography>
              )}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseFollowingsModal} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default ProfileHeader;
