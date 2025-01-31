import {
  Avatar,
  Card,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { format } from "date-fns";
import { useAuth } from "../utils/AuthContext";
import { BASE_URL } from "../utils/constants";

const Notifications = () => {
  const { markAsRead, notifications } = useAuth();

  if (notifications.length === 0) {
    return (
      <div className="m-auto">
        <Typography variant="h5" color="textSecondary">
          No notifications to display
        </Typography>
      </div>
    );
  }

  return (
    <div className="w-full">
      {notifications.map((notif) => (
        <Card
          key={notif._id}
          className={`flex items-center space-x-4 mb-4 p-4 shadow-lg rounded-xl border ${
            notif.isRead ? "bg-gray-100" : "bg-white"
          } max-w-3xl mx-auto`}
        >
          <Avatar src={`${BASE_URL}${notif.logo}`} alt={notif.user} />
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
            <IconButton onClick={() => markAsRead(notif._id)}>
              <CheckCircleIcon color="success" />
            </IconButton>
          )}
        </Card>
      ))}
    </div>
  );
};

export default Notifications;
