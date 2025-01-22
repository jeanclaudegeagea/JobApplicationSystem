const express = require("express");
const ConnectionController = require("../controllers/ConnectionController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/follow", authMiddleware, ConnectionController.follow);
router.post("/unfollow", authMiddleware, ConnectionController.unfollow);

router.get(
  "/get/followers",
  authMiddleware,
  ConnectionController.getAllFollowers
);
router.get(
  "/get/followings",
  authMiddleware,
  ConnectionController.getAllFollowings
);

module.exports = router;
