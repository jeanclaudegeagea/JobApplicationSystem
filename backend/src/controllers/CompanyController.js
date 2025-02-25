const upload = require("../config/multerConfig");
const CompanyService = require("../services/CompanyService");

class CompanyController {
  async register(req, res) {
    try {
      const requiredFields = ["name", "email", "phoneNumber", "password"];

      const companyData = req.body;

      const missingFields = requiredFields.filter(
        (field) => !companyData[field]?.trim()
      );

      if (missingFields.length > 0) {
        return res.status(400).json({
          error: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }
      const newCompany = await CompanyService.createCompany(companyData);
      res.status(201).json({
        message: "Company registered successfully",
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email?.trim() || !password?.trim()) {
        return res.status(401).json({
          error: "All fields are required",
        });
      }

      const company = await CompanyService.login(email, password);
      res.status(200).json(company);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getCompany(req, res) {
    try {
      const { userId } = req.params;

      const company = await CompanyService.getCompanyById(userId);
      res.status(200).json({ company });
    } catch (error) {
      res.status(500).json({ error: error.json });
    }
  }

  async updateCompany(req, res) {
    try {
      upload.fields([{ name: "logo", maxCount: 1 }])(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        const updateData = req.body;
        if (req.files.logo) {
          updateData.logo = `/uploads/${req.files.logo[0].filename}`;
        }
        const updatedCompany = await CompanyService.updateCompanyById(
          req.companyId,
          updateData
        );
        res
          .status(200)
          .json({ message: "Company updated successfully", updatedCompany });
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteCompany(req, res) {
    try {
      const { companyId } = req.params;

      await CompanyService.deleteCompanyById(companyId);
      res.status(200).json({
        message: "Company deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
  async getApplyingUsers(req, res) {
    try {
      const { companyId } = req.params;

      const result = await CompanyService.getApplyingUsers(companyId);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
}

module.exports = new CompanyController();
