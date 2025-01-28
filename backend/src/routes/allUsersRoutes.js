const express = require("express");
const combinedMiddleware = require("../middleware/combinedMiddleware");
const AllUsersController = require("../controllers/AllUsersController");

const router = express.Router();

router.get("", combinedMiddleware, AllUsersController.getAllUsers);

module.exports = router;
