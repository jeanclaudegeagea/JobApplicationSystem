import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import { Home, Notifications } from "@mui/icons-material";
import { useAuth } from "../../utils/AuthContext";
import { useNavigate } from "react-router";

const Navbar = () => {
  const {
    userData: { user },
  } = useAuth();
  const navigate = useNavigate();

  const navElements = [
    {
      path: "/home",
      icon: <Home />,
    },
    {
      path: "/notification",
      icon: (
        <Badge>
          <Notifications />
        </Badge>
      ),
    },
    {
      path: "/profile",
      icon: (
        <Avatar
          alt="Profile"
          src={user.logo}
          sx={{
            width: 40,
            height: 40,
            "&:hover": { boxShadow: 3 },
          }}
        />
      ),
    },
  ];

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
        {/* Logo or Brand */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "primary.main", // Matches MUI's theme primary color
          }}
        >
          Job Tracker
        </Typography>

        {/* Navigation Icons */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {navElements.map((navItem, index) => (
            <IconButton
              key={index}
              onClick={() => navigate(navItem.path)}
              sx={{
                color: "text.secondary", // MUI default gray color
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
