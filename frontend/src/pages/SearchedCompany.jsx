import { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { terror } from "../utils/toasts";
import { useAuth } from "../utils/AuthContext";
import { BASE_URL, URL } from "../utils/constants";
import { ClipLoader } from "react-spinners";
import { Card, CardContent, Avatar, Typography, Button } from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Language,
  Email,
  Phone,
} from "@mui/icons-material";

const SearchedCompany = () => {
  const { companyId } = useParams();
  const {
    setIsSessionExpiredOpen,
    userData: { token, type, user, company: userCompany },
  } = useAuth();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(
        `${URL}/companies/company/${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCompany(data.company);
    } catch (error) {
      console.log(error);

      if (error["response"]["data"]["error"] === "Session expired") {
        setIsSessionExpiredOpen(true);
      } else terror(error["response"]["data"]["error"] || "Error");
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async () => {
    setIsFollowing(!isFollowing);
    setIsPending(true);

    try {
      await axios.post(
        `${URL}/connections/${isFollowing ? "unfollow" : "follow"}`,
        {
          follower: user ? user?._id : userCompany?._id,
          followerType: type,
          following: companyId,
          followingType: "Company",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
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
          follower: user ? user?._id : userCompany?._id,
          following: companyId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setIsFollowing(data);
    } catch (error) {
      if (error["response"]["data"]["error"] === "Session expired") {
        setIsSessionExpiredOpen(true);
      } else terror(error["response"]["data"]["error"] || "Error");
    }
  };

  useEffect(() => {
    fetchCompanyData();
    isConnection();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <ClipLoader size={50} color="#0077B5" />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        backgroundColor: "#F9FAFB",
        padding: 24,
      }}
    >
      {company ? (
        <Card
          sx={{
            maxWidth: 500,
            width: "100%",
            boxShadow: 3,
            borderRadius: 3,
            backgroundColor: "white",
            padding: 3,
            transition: "0.3s",
            "&:hover": { boxShadow: 6 },
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              src={`${BASE_URL}${company.logo}`}
              alt={company.name}
              sx={{
                width: 96,
                height: 96,
                mb: 2,
                border: "2px solid",
                borderColor: "grey.300",
                boxShadow: 2,
              }}
            />
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "grey.900" }}
            >
              {company.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "grey.600" }}>
              {company.industry}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "grey.500", mt: 1, textAlign: "center", px: 2 }}
            >
              {company.description}
            </Typography>
            <div
              style={{
                marginTop: 16,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "grey.600",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                📍 {company.location}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "grey.600",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Email fontSize="small" /> {company.email}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "grey.600",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Phone fontSize="small" /> {company.phoneNumber}
              </Typography>
              {company.website !== "Not provided" && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#0077B5",
                    fontWeight: "500",
                    marginTop: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    textDecoration: "none",
                  }}
                >
                  <Language fontSize="small" /> Visit Website
                </a>
              )}
            </div>

            {/* Follow Button */}
            <Button
              variant="contained"
              color={isFollowing ? "error" : "primary"}
              sx={{
                mt: 4,
                px: 3,
                py: 1,
                borderRadius: "9999px",
                boxShadow: 2,
                transition: "0.2s",
                "&:hover": { transform: "scale(1.05)" },
              }}
              onClick={toggleFollow}
              disabled={isPending} // Disable button while loading
            >
              {isPending ? (
                <ClipLoader size={20} color="white" />
              ) : isFollowing ? (
                <>
                  <Favorite /> Unfollow
                </>
              ) : (
                <>
                  <FavoriteBorder /> Follow
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="h6" sx={{ color: "grey.700" }}>
          Company not found
        </Typography>
      )}
    </div>
  );
};

export default SearchedCompany;
