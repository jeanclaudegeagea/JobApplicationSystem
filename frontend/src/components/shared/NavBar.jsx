import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import { Home, Notifications, Work, AddCircle } from "@mui/icons-material";
import { useAuth } from "../../utils/AuthContext";
import { useNavigate } from "react-router";
import axios from "axios";
import { terror } from "../../utils/toasts";
import { URL } from "../../utils/constants";
import TextField from "@mui/material/TextField"; // MUI TextField for the search bar

const uploadsUrl = "http://localhost:5000";

const Navbar = () => {
  const {
    userData: { user, type, company, token },
    setIsSessionExpiredOpen,
  } = useAuth();
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false); // For toggling dropdown visibility

  const navElements = [
    {
      path: "/home",
      icon: <Home />,
    },
  ];

  if (type === "User") {
    navElements.push({
      path: "/apply-job",
      icon: <Work />,
    });
  } else if (type === "Company") {
    navElements.push({
      path: "/create-job",
      icon: <AddCircle />,
    });
  }

  navElements.push({
    path: "/notification",
    icon: (
      <Badge badgeContent={6} color="error">
        <Notifications />
      </Badge>
    ),
  });

  navElements.push({
    path: "/profile",
    icon: (
      <Avatar
        alt="Profile"
        src={
          user
            ? `${uploadsUrl}${user?.profilePicture}`
            : `${uploadsUrl}${company?.logo}`
        }
        sx={{
          width: 40,
          height: 40,
          "&:hover": { boxShadow: 3 },
        }}
      />
    ),
  });

  const getAllUsers = async () => {
    try {
      const { data } = await axios.get(`${URL}/allUsers`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setAllUsers(data); // Store all users in state
    } catch (error) {
      console.log(error);

      if (error["response"]["data"]["error"] === "Session expired") {
        setIsSessionExpiredOpen(true);
      } else terror(error["response"]["data"]["error"] || "Error");
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const setSearch = (search) => {
    setSearchQuery(search);

    if (search === "") {
      setFilteredUsers([]);
    } else {
      const filtered = allUsers.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleSearchFocus = () => {
    setShowDropdown(true); // Show the dropdown when the search bar is focused
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setShowDropdown(false); // Hide the dropdown after some time to allow click event on dropdown items
    }, 200);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "white",
        boxShadow: 2,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          width: "100%",
          mx: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {/* Logo or Brand */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "primary.main",
            }}
          >
            Job Tracker
          </Typography>

          {/* Search Bar */}
          <div className="relative">
            <TextField
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              placeholder="Search users"
              size="small"
              sx={{ width: "250px" }}
              autoComplete="off"
            />

            {/* Custom Dropdown */}
            {showDropdown && filteredUsers.length > 0 && (
              <div className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                {filteredUsers.map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => navigate(`/profile/${user.id}`)}
                  >
                    <Avatar
                      alt={user.name}
                      src={user.logo}
                      sx={{ width: 30, height: 30, marginRight: 2 }}
                    />
                    <span className="text-gray-800 font-semibold hover:text-gray-900 truncate">
                      {user.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {/* Navigation Icons */}
          {navElements.map((navItem, index) => (
            <IconButton
              key={index}
              onClick={() => navigate(navItem.path)}
              sx={{
                color: "text.secondary",
                "&:hover": { color: "primary.main" },
              }}
            >
              {navItem.icon}
            </IconButton>
          ))}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
