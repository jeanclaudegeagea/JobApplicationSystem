const express = require("express");
const UserController = require("../controllers/UserController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);

router.get("/profile", authMiddleware, UserController.getProfile);
router.put("/profile", authMiddleware, UserController.updateProfile);
router.delete("/profile", authMiddleware, UserController.deleteProfile);

module.exports = router;
