const express = require("express");
const ConnectionController = require("../controllers/ConnectionController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

module.exports = router;
