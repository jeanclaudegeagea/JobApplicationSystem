const Company = require("../models/Company");

class CompanyRepository {
  async create(companyData) {
    const company = new Company(companyData);
    return await company.save();
  }

  async findById(id) {
    return await Company.findById(id);
  }

  async findAll(filter = {}) {
    return await Company.find(filter);
  }

  async updateById(id, updateData) {
    return await Company.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteById(id) {
    return await Company.findByIdAndDelete(id);
  }
}

module.exports = new CompanyRepository();
