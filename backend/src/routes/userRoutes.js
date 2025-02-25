const express = require("express");
const UserController = require("../controllers/UserController");
const authMiddleware = require("../middleware/authMiddleware");
const combinedMiddleware = require("../middleware/combinedMiddleware");

const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);

router.get("/profile/:userId", combinedMiddleware, UserController.getProfile);
router.put("/profile", authMiddleware, UserController.updateProfile);
router.delete("/profile/:userId", authMiddleware, UserController.deleteProfile);

module.exports = router;
