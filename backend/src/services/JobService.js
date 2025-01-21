const JobRepository = require("../repositories/JobRepository");

class JobService {
  async createJob(jobData) {
    return await JobRepository.create(jobData);
  }

  async getJobById(id) {
    return await JobRepository.findById(id);
  }

  async getAllJobs(filter = {}) {
    return await JobRepository.findAll(filter);
  }

  async updateJobById(id, updateData) {
    return await JobRepository.updateById(id, updateData);
  }

  async deleteJobById(id) {
    return await JobRepository.deleteById(id);
  }
}

module.exports = new JobService();
