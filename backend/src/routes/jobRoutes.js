const express = require("express");
const JobController = require("../controllers/JobController");
const combinedMiddleware = require("../middleware/combinedMiddleware");
const companyMiddleware = require("../middleware/companyMiddleware");

const router = express.Router();

// Routes accessible by both companies and normal users
router.get("/", combinedMiddleware, JobController.getAllJobs);
router.get("/:id", combinedMiddleware, JobController.getJobById);

// Routes accessible only by companies
router.post("/", companyMiddleware, JobController.createJob);
router.put("/:id", companyMiddleware, JobController.updateJobById);
router.delete("/:id", companyMiddleware, JobController.deleteJobById);

module.exports = router;
