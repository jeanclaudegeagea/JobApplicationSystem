import axios from "axios";
import { BASE_URL, URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import ProfileHeader from "../components/CompanyProfile/ProfileHeader";
import JobCard from "./JobCard";
import { terror } from "../utils/toasts";
import { useAuth } from "../utils/AuthContext";

const CompanyProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    location: "",
    logo: "",
    website: "",
    industry: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const { setIsSessionExpiredOpen } = useAuth();

  const fetchProfile = async () => {
    try {
      const localData = JSON.parse(localStorage.getItem("userData"));
      const token = localData.token;
      const companyId = localData.company._id;

      const response = await axios.get(
        `${URL}/companies/company/${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const updatedProfile = {
        ...response.data.company,
        logo: response.data.company.logo
          ? `${BASE_URL}${response.data.company.logo}`
          : "",
      };
      setProfile(updatedProfile);
    } catch (error) {
      console.error("Error fetching profile", error);

      if (error.response?.data?.error === "Session expired") {
        setIsSessionExpiredOpen(true);
      } else {
        terror(error.response?.data?.error || "Error");
      }
    }
  };

  const fetchJobs = async () => {
    try {
      const localData = JSON.parse(localStorage.getItem("userData"));
      const token = localData.token;
      const companyId = localData.company._id;

      const response = await axios.get(`${URL}/jobs?companyId=${companyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs", error);

      if (error.response?.data?.error === "Session expired") {
        setIsSessionExpiredOpen(true);
      } else {
        terror(error.response?.data?.error || "Error");
      }
    }
  };

  const fetchApplications = async () => {
    try {
      const localData = JSON.parse(localStorage.getItem("userData"));
      const token = localData.token;
      const companyId = localData.company._id;

      const response = await axios.get(
        `${URL}/applications?companyId=${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications", error);

      if (error.response?.data?.error === "Session expired") {
        setIsSessionExpiredOpen(true);
      } else {
        terror(error.response?.data?.error || "Error");
      }
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchJobs();
    fetchApplications();
  }, []);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoFile(file);
        setProfile((prev) => ({
          ...prev,
          logo: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("name", profile.name);
    formData.append("email", profile.email);
    formData.append("phoneNumber", profile.phoneNumber);
    formData.append("location", profile.location);
    formData.append("description", profile.description);
    formData.append("website", profile.website);
    formData.append("industry", profile.industry);
    if (logoFile) {
      formData.append("logo", logoFile);
    }

    try {
      const localData = JSON.parse(localStorage.getItem("userData"));
      const token = localData.token;

      const response = await axios.put(`${URL}/companies/company`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile", error);

      if (error.response?.data?.error === "Session expired") {
        setIsSessionExpiredOpen(true);
      } else {
        terror(error.response?.data?.error || "Error");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    window.location.reload();
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" padding={4}>
      <ProfileHeader
        profile={profile}
        isEditing={isEditing}
        handleEditToggle={handleEditToggle}
        handleInputChange={handleInputChange}
        handleImageUpload={handleImageUpload}
        handleSubmit={handleSubmit}
        handleLogout={handleLogout}
      />
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="profile tabs"
      >
        <Tab
          label="Posted Jobs"
          icon={<DynamicFeedIcon />}
          iconPosition="start"
        />
        <Tab label="Applications" />
      </Tabs>
      {tabValue === 0 && (
        <Box width="100%">
          <div className="grid grid-cols-3 gap-3 px-10 pt-2">
            {jobs.map((job) => (
              <div key={job._id}>
                <JobCard job={job} isCompany={true} />
              </div>
            ))}
          </div>
        </Box>
      )}
      {tabValue === 1 && (
        <Box width="100%">
          <p>Hi</p>
        </Box>
      )}
    </Box>
  );
};

export default CompanyProfile;
