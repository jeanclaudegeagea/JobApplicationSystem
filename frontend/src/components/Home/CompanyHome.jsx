import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, Card, CardContent, Typography, Box } from "@mui/material";
import { format } from "date-fns";
import ClipLoader from "react-spinners/ClipLoader";
import { terror } from "../../utils/toasts";
import { URL, BASE_URL } from "../../utils/constants";

const CompanyHome = ({ token, company, setIsSessionExpiredOpen }) => {
  const [loading, setLoading] = useState(true);
  const [applyingUsers, setApplyingUsers] = useState([]);

  const getApplyingUsers = async () => {
    try {
      const { data } = await axios.get(
        `${URL}/companies/company/applying-users/${company?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setApplyingUsers(data);
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.error === "Session expired") {
        setIsSessionExpiredOpen(true);
      } else {
        terror(error?.response?.data?.error || "Error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getApplyingUsers();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <ClipLoader size={50} color="#3f51b5" />
      </Box>
    );
  }

  if (applyingUsers.length === 0) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography variant="h5" color="textSecondary">
          No new applying users
        </Typography>
      </Box>
    );
  }

  return (
    <Box width="100%" display="flex" flexDirection="column" alignItems="center">
      {applyingUsers.map((user, index) => (
        <Card
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
            p: 2,
            boxShadow: 3,
            borderRadius: 2,
            width: "90%",
            maxWidth: "600px",
          }}
        >
          <Avatar
            src={`${BASE_URL}${user.userPP}`}
            alt="User Profile"
            sx={{ width: 56, height: 56 }}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="body1" fontWeight="bold">
              {user.text}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {format(new Date(), "M/d/yyyy, h:mm:ss a")}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default CompanyHome;
