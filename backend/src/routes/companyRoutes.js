const express = require("express");
const companyMiddleware = require("../middleware/companyMiddleware");
const CompanyController = require("../controllers/CompanyController");
const combinedMiddleware = require("../middleware/combinedMiddleware");

const router = express.Router();

router.post("/register", CompanyController.register);
router.post("/login", CompanyController.login);

router.get(
  "/company/:userId",
  combinedMiddleware,
  CompanyController.getCompany
);
router.put("/company", companyMiddleware, CompanyController.updateCompany);
router.delete("/company", companyMiddleware, CompanyController.deleteCompany);

module.exports = router;
