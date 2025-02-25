const JobService = require("../services/JobService");

class JobController {
  async createJob(req, res) {
    try {
      const jobData = req.body;
      const job = await JobService.createJob(jobData);
      res.status(201).json(job);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getJobById(req, res) {
    try {
      const { id } = req.params;
      const job = await JobService.getJobById(id);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.status(200).json(job);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllJobs(req, res) {
    try {
      const filter = {};

      // Extract filters from query parameters
      if (req.query.title) {
        filter.title = { $regex: req.query.title, $options: "i" }; // Case-insensitive search
      }

      if (req.query.location) {
        filter.location = { $regex: req.query.location, $options: "i" };
      }

      if (req.query.jobType) {
        filter.jobType = { $regex: req.query.jobType, $options: "i" };
      }

      if (req.query.experienceRequired) {
        filter.experienceRequired = {
          $regex: req.query.experienceRequired,
          $options: "i",
        };
      }

      // Handling companyId filter if provided
      if (req.query.companyId) {
        filter.company = req.query.companyId;
      }

      // Fetch filtered jobs
      const jobs = await JobService.getAllJobs(filter);
      res.status(200).json(jobs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateJobById(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const job = await JobService.updateJobById(id, updateData);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.status(200).json(job);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteJobById(req, res) {
    try {
      const { id } = req.params;
      const job = await JobService.deleteJobById(id);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new JobController();
