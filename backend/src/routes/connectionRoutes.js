const express = require("express");
const ConnectionController = require("../controllers/ConnectionController");
const {
  sendFollowNotification,
} = require("../controllers/NotificationController");
const authMiddleware = require("../middleware/authMiddleware");
const combinedMiddleware = require("../middleware/combinedMiddleware");

const router = express.Router();

router.post(
  "/follow",
  combinedMiddleware,
  ConnectionController.follow,
  sendFollowNotification
);
router.post("/unfollow", combinedMiddleware, ConnectionController.unfollow);

router.post(
  "/isFollowing",
  combinedMiddleware,
  ConnectionController.isFollowing
);

router.get(
  "/get/followers/:userId",
  combinedMiddleware,
  ConnectionController.getAllFollowers
);
router.get(
  "/get/followings/:userId",
  combinedMiddleware,
  ConnectionController.getAllFollowings
);

module.exports = router;
