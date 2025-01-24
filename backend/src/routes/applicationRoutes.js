const express = require("express");
const ApplicationController = require("../controllers/ApplicationController");
const companyMiddleware = require("../middleware/companyMiddleware");
const combinedMiddleware = require("../middleware/combinedMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("", authMiddleware, ApplicationController.createApplication);

router.get(
  "/:id",
  combinedMiddleware,
  ApplicationController.getApplicationById
);
router.get("", combinedMiddleware, ApplicationController.getAllApplications);

router.put(
  "/:id",
  companyMiddleware,
  ApplicationController.updateApplicationById
);
router.delete(
  "/:id",
  companyMiddleware,
  ApplicationController.deleteApplicationById
);

module.exports = router;
