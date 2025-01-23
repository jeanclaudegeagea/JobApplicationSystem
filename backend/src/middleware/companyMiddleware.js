const CompanyAuthService = require("../services/CompanyAuthService");

module.exports = function (req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(403).json({
      error: "Access denied",
    });
  }

  try {
    const decoded = CompanyAuthService.verifyToken(token);

    if (!decoded.companyId) {
      return res
        .status(403)
        .json({ message: "Access denied, incorrect role (company expected)" });
    }

    req.companyId = decoded.companyId;
    next();
  } catch (error) {
    return res.status(403).json({
      error: "Session expired",
    });
  }
};
