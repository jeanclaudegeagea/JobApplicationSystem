const ApplicationRepository = require("../repositories/ApplicationRepository");

class ApplicationService {
  async createApplication(applicationData) {
    return await ApplicationRepository.create(applicationData);
  }

  async getApplicationById(id) {
    return await ApplicationRepository.findById(id);
  }

  async getAllApplications(filter = {}) {
    return await ApplicationRepository.findAll(filter);
  }

  async updateApplicationById(id, updateData) {
    return await ApplicationRepository.updateById(id, updateData);
  }

  async deleteApplicationById(id) {
    return await ApplicationRepository.deleteById(id);
  }

  async checkApplication(jobId, userId) {
    return await ApplicationRepository.checkApplication(jobId, userId);
  }
}

module.exports = new ApplicationService();
