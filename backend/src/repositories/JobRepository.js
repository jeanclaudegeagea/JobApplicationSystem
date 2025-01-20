const Job = require("../models/Job");

class JobRepository {
  async create(jobData) {
    const job = new Job(jobData);
    return await job.save();
  }

  async findById(id) {
    return await Job.findById(id).populate("company");
  }

  async findAll(filter = {}) {
    return await Job.find(filter).populate("company");
  }

  async updateById(id, updateData) {
    return await Job.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteById(id) {
    return await Job.findByIdAndDelete(id);
  }
}

module.exports = new JobRepository();
