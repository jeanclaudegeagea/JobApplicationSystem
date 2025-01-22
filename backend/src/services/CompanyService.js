const bcrypt = require("bcrypt");
const CompanyRepository = require("../repositories/CompanyRepository");
const AuthService = require("./AuthService");

class CompanyService {
  async createCompany(companyData) {
    const hashedPassword = await bcrypt.hash(companyData.password, 10);
    companyData.password = hashedPassword;
    const company = await CompanyRepository.create(companyData);
    return company;
  }

  async login(email, password) {
    const company = await CompanyRepository.findByEmail(email);
    if (!company) throw new Error("Company not found");

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = AuthService.generateToken(company._id);
    return { company, token, type: "Company" };
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
