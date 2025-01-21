const bcrypt = require("bcrypt");
const CompanyRepository = require("../repositories/CompanyRepository");

class CompanyService {
  async createCompany(companyData) {
    const hashedPassword = await bcrypt.hash(companyData.password, 10);
    companyData.password = hashedPassword;
    const company = await CompanyRepository.create(companyData);
    return company;
  }

  async getCompanyById(id) {
    return await CompanyRepository.findById(id);
  }

  async getAllCompanies(filter = {}) {
    return await CompanyRepository.findAll(filter);
  }

  async updateCompanyById(id, updateData) {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    return await CompanyRepository.updateById(id, updateData);
  }

  async deleteCompanyById(id) {
    return await CompanyRepository.deleteById(id);
  }
}

module.exports = new CompanyService();
