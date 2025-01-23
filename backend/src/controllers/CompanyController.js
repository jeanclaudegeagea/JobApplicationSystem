const CompanyService = require("../services/CompanyService");

class CompanyController {
  async register(req, res) {
    try {
      const companyData = req.body;
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
      const company = await CompanyService.getCompanyById(req.userId);
      res.status(200).json(company);
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
          req.userId,
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
      await CompanyService.deleteCompanyById(req.userId);
      res.status(200).json({
        message: "Company deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
}

module.exports = new CompanyController();
