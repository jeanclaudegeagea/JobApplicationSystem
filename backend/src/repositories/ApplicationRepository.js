const Application = require("../models/Application");

class ApplicationRepository {
  async create(applicationData) {
    const application = new Application(applicationData);
    return await application.save();
  }

  async findById(id) {
    return await Application.findById(id)
      .populate("user")
      .populate({
        path: "job",
        populate: { path: "company" },
      });
  }

  async findAll(filter = {}) {
    return await Application.find(filter)
      .populate("user")
      .populate({
        path: "job",
        populate: { path: "company" },
      });
  }

  async updateById(id, updateData) {
    return await Application.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteById(id) {
    return await Application.findByIdAndDelete(id);
  }

  async checkApplication(jobId, userId) {
    const application = await Application.findOne({ job: jobId, user: userId });
    return !!application;
  }
}

module.exports = new ApplicationRepository();
