import { useEffect, useState } from "react";
import axios from "axios";
import { URL, BASE_URL } from "../utils/constants";
import { useAuth } from "../utils/AuthContext";
import { terror } from "../utils/toasts";
import { useParams } from "react-router";
import { ClipLoader } from "react-spinners";
import {
  Avatar,
  Button,
  Typography,
  Card,
  CardContent,
  Divider,
  Box,
} from "@mui/material";

const SearchedUser = () => {
  const { userId } = useParams();
  const {
    setIsSessionExpiredOpen,
    userData: { token, type, user, company },
  } = useAuth();

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const [searchedUser, setSearchedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const toggleFollow = async () => {
    setIsFollowing(!isFollowing);
    setIsPending(true);

    try {
      await axios.post(
        `${URL}/connections/${isFollowing ? "unfollow" : "follow"}`,
        {
          follower: user ? user?._id : company?._id,
          followerType: type,
          following: userId,
          followingType: "User",
        },
        { headers }
      );
    } catch (error) {
      setIsFollowing(isFollowing);

      if (error["response"]["data"]["error"] === "Session expired") {
        setIsSessionExpiredOpen(true);
      } else terror(error["response"]["data"]["error"] || "Error");
    } finally {
      setIsPending(false);
    }
  };

  const isConnection = async () => {
    try {
      const { data } = await axios.post(
        `${URL}/connections/isFollowing`,
        {
          follower: user ? user?._id : company?._id,
          following: userId,
        },
        { headers }
      );
      setIsFollowing(data);
    } catch (error) {
      if (error["response"]["data"]["error"] === "Session expired") {
        setIsSessionExpiredOpen(true);
      } else terror(error["response"]["data"]["error"] || "Error");
    }
  };

  const fetchUserData = async () => {
    try {
      const { data } = await axios.get(`${URL}/users/profile/${userId}`, {
        headers,
      });
      setSearchedUser(data?.user);
    } catch (error) {
      console.log(error);

      if (error["response"]["data"]["error"] === "Session expired") {
        setIsSessionExpiredOpen(true);
      } else terror(error["response"]["data"]["error"] || "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    isConnection();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <ClipLoader size={50} color="#0077B5" />
      </Box>
    );
  }

  if (!searchedUser) {
    return (
      <Typography variant="h6" align="center" color="textSecondary">
        User not found
      </Typography>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      height="100%"
      sx={{ backgroundColor: "#F9FAFB", p: 2 }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 600,
          height: "80vh",
          overflowY: "auto",
          boxShadow: 3,
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={`${BASE_URL}${searchedUser.profilePicture}`}
              alt={searchedUser.name}
              sx={{ width: 80, height: 80 }}
            />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {searchedUser.name}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {searchedUser.location}
              </Typography>
              <Button
                variant="contained"
                color={isFollowing ? "secondary" : "primary"}
                onClick={toggleFollow}
                disabled={isPending}
                sx={{ mt: 2 }}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            </Box>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" fontWeight="bold">
            Experience
          </Typography>
          {searchedUser.experience?.length > 0 ? (
            searchedUser.experience.map((exp, index) => (
              <Box key={index} my={2}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {exp.position} at {exp.company}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {new Date(exp.startDate).toLocaleDateString()} -{" "}
                  {exp.endDate
                    ? new Date(exp.endDate).toLocaleDateString()
                    : "Present"}
                </Typography>
                <Typography variant="body2">{exp.description}</Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No experience listed
            </Typography>
          )}
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" fontWeight="bold">
            Education
          </Typography>
          {searchedUser.university?.length > 0 ? (
            searchedUser.university.map((edu, index) => (
              <Box key={index} my={2}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {edu.degree} in {edu.major}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {edu.universityName} ({new Date(edu.startDate).getFullYear()}{" "}
                  -{" "}
                  {edu.endDate
                    ? new Date(edu.endDate).getFullYear()
                    : "Present"}
                  )
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No education listed
            </Typography>
          )}
          {searchedUser.cv && searchedUser.cv !== "No CV uploaded" && (
            <Box mt={4}>
              <Typography variant="h6" fontWeight="bold">
                CV
              </Typography>
              <iframe
                src={`${BASE_URL}${searchedUser.cv}`}
                style={{ width: "100%", height: "400px", border: "none" }}
                title="CV Viewer"
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SearchedUser;
