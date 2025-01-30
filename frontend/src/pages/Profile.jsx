import React, { useEffect, useState } from "react";
import { Box, Stack, Tabs, Tab } from "@mui/material";
import { ListAlt, Work } from "@mui/icons-material";
import axios from "axios";
import { URL } from "../utils/constants";
import EducationSection from "../components/EducationSection";
import AppliedJobsSection from "../components/AppliedJobsSection";
import ExperienceSection from "../components/ExperienceSection";
import ProfileHeader from "../components/ProfileHeader";
import { terror } from "../utils/toasts";
import { useAuth } from "../utils/AuthContext";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    location: "",
    profilePicture: "",
    experience: [],
    university: [],
    cv: "",
  });
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const { setIsSessionExpiredOpen } = useAuth();

  const fetchProfile = async () => {
    try {
      const localData = JSON.parse(localStorage.getItem("userData"));
      const token = localData.token;
      const userId = localData?.user?._id;

      const response = await axios.get(`${URL}/users/profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const updatedProfile = {
        ...response.data.user,
        profilePicture: response.data.user.profilePicture
          ? `http://localhost:5000${response.data.user.profilePicture}`
          : "",
      };

      setProfile(updatedProfile);
    } catch (error) {
      console.error("Error fetching profile", error);

      if (error["response"]["data"]["error"] === "Session expired") {
        setIsSessionExpiredOpen(true);
      } else terror(error["response"]["data"]["error"] || "Error");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...profile.experience];
    updatedExperience[index][field] = value;
    setProfile((prev) => ({ ...prev, experience: updatedExperience }));
  };

  const handleUniversityChange = (index, field, value) => {
    const updatedUniversity = [...profile.university];
    updatedUniversity[index][field] = value;
    setProfile((prev) => ({ ...prev, university: updatedUniversity }));
  };

  const handleAddExperience = () => {
    setProfile((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          position: "",
          company: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));
  };

  const handleRemoveExperience = (index) => {
    const updatedExperience = profile.experience.filter((_, i) => i !== index);
    setProfile((prev) => ({ ...prev, experience: updatedExperience }));
  };

  const handleAddUniversity = () => {
    setProfile((prev) => ({
      ...prev,
      university: [
        ...prev.university,
        {
          degree: "",
          major: "",
          universityName: "",
          startDate: "",
          endDate: "",
        },
      ],
    }));
  };

  const handleRemoveUniversity = (index) => {
    const updatedUniversity = profile.university.filter((_, i) => i !== index);
    setProfile((prev) => ({ ...prev, university: updatedUniversity }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePictureFile(file);
        setProfile((prev) => ({
          ...prev,
          profilePicture: reader.result, // Use Data URL as the image source
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFile(file);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    // Append profile data
    formData.append("name", profile.name);
    formData.append("email", profile.email);
    formData.append("phoneNumber", profile.phoneNumber);
    formData.append("location", profile.location);
    formData.append("experience", JSON.stringify(profile.experience));
    formData.append("university", JSON.stringify(profile.university));
    if (profilePictureFile) {
      formData.append("profilePicture", profilePictureFile);
    }
    if (cvFile) {
      formData.append("cv", cvFile);
    }

    try {
      const localData = JSON.parse(localStorage.getItem("userData"));
      const token = localData.token;

      const response = await axios.put(`${URL}/users/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile", error);
      if (error["response"]["data"]["error"] === "Session expired") {
        setIsSessionExpiredOpen(true);
      } else terror(error["response"]["data"]["error"] || "Error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    window.location.reload();
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" padding={4}>
      <ProfileHeader
        profile={profile}
        isEditing={isEditing}
        handleEditToggle={handleEditToggle}
        handleInputChange={handleInputChange}
        handleImageUpload={handleImageUpload}
        handleCvUpload={handleCvUpload}
        handleSubmit={handleSubmit}
        handleLogout={handleLogout}
      />

      <Box sx={{ width: "100%", marginTop: 1 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab
            icon={<Work />}
            label="Experience & Education"
            iconPosition="start" // Places the icon next to the label
          />
          <Tab
            icon={<ListAlt />}
            label="Applied Jobs"
            iconPosition="start" // Places the icon next to the label
          />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Box marginTop={4} width="100%">
          <Stack direction="row" spacing={4}>
            <ExperienceSection
              profile={profile}
              isEditing={isEditing}
              handleExperienceChange={handleExperienceChange}
              handleAddExperience={handleAddExperience}
              handleRemoveExperience={handleRemoveExperience}
            />
            <EducationSection
              profile={profile}
              isEditing={isEditing}
              handleUniversityChange={handleUniversityChange}
              handleAddUniversity={handleAddUniversity}
              handleRemoveUniversity={handleRemoveUniversity}
            />
          </Stack>
        </Box>
      )}

      {tabValue === 1 && <AppliedJobsSection />}
    </Box>
  );
};

export default Profile;
