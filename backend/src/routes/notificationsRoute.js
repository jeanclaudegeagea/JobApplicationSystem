const express = require("express");
const NotificationController = require("../controllers/NotificationController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/get/notifications/:userId",
  authMiddleware,
  NotificationController.getUsersNotifications
);
router.patch(
  "/readNotification/:notificationId",
  authMiddleware,
  NotificationController.readNotification
);

module.exports = router;
