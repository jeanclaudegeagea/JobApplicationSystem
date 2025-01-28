const express = require("express");
const NotificationController = require("../controllers/NotificationController");
const combinedMiddleware = require("../middleware/combinedMiddleware");

const router = express.Router();

router.get(
  "/get/notifications/:userId",
  combinedMiddleware,
  NotificationController.getUsersNotifications
);
router.patch(
  "/readNotification/:notificationId",
  combinedMiddleware,
  NotificationController.readNotification
);

module.exports = router;
