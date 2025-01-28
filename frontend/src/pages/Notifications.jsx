import React, { useState, useEffect } from "react";
import {
  Avatar,
  Card,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { format } from "date-fns";
import axios from "axios";
import { URL } from "../utils/constants";
import { useAuth } from "../utils/AuthContext";
import { terror } from "../utils/toasts";

const dummyNotifications = [
  {
    id: 1,
    message: "You have a new connection request!",
    date: new Date("2025-01-28T14:00:00"),
    user: "John Doe",
    userAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
    isRead: false,
  },
  {
    id: 2,
    message: "Your article has been commented on.",
    date: new Date("2025-01-27T11:30:00"),
    user: "Jane Smith",
    userAvatar: "https://randomuser.me/api/portraits/women/2.jpg",
    isRead: false,
  },
  {
    id: 3,
    message: "Someone viewed your profile.",
    date: new Date("2025-01-26T18:15:00"),
    user: "Bob Johnson",
    userAvatar: "https://randomuser.me/api/portraits/men/3.jpg",
    isRead: true,
  },
  {
    id: 4,
    message: "You have a new connection request!",
    date: new Date("2025-01-28T14:00:00"),
    user: "John Doe",
    userAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
    isRead: false,
  },
  {
    id: 5,
    message: "Your article has been commented on.",
    date: new Date("2025-01-27T11:30:00"),
    user: "Jane Smith",
    userAvatar: "https://randomuser.me/api/portraits/women/2.jpg",
    isRead: false,
  },
  {
    id: 6,
    message: "Someone viewed your profile.",
    date: new Date("2025-01-26T18:15:00"),
    user: "Bob Johnson",
    userAvatar: "https://randomuser.me/api/portraits/men/3.jpg",
    isRead: true,
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(dummyNotifications);
  const {
    setIsSessionExpiredOpen,
    userData: { user, company, token },
  } = useAuth();

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const getNotification = async () => {
    try {
      const { data } = await axios.get(
        `${URL}/notifications/get/notifications/${user?._id || company?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.log(error);

      if (error?.repsonse?.data?.error === "Session expired") {
        setIsSessionExpiredOpen(true);
      } else terror(error?.repsonse?.data?.error || "Error");
    }
  };

  useEffect(() => {
    getNotification();
  }, []);

  return (
    <div className="w-full">
      {notifications.map((notif) => (
        <Card
          key={notif.id}
          className={`flex items-center space-x-4 mb-4 p-4 shadow-lg rounded-xl border ${
            notif.isRead ? "bg-gray-100" : "bg-white"
          } max-w-3xl mx-auto`}
        >
          <Avatar src={notif.userAvatar} alt={notif.user} />
          <CardContent className="flex-grow">
            <Typography
              variant="body1"
              fontWeight={notif.isRead ? "normal" : "bold"}
            >
              {notif.message}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {format(notif.date, "M/d/yyyy, h:mm:ss a")}
            </Typography>
            <Typography variant="body2" color="primary" fontWeight={600}>
              {notif.user}
            </Typography>
          </CardContent>
          {!notif.isRead && (
            <IconButton onClick={() => markAsRead(notif.id)}>
              <CheckCircleIcon color="success" />
            </IconButton>
          )}
        </Card>
      ))}
    </div>
  );
};

export default Notifications;
