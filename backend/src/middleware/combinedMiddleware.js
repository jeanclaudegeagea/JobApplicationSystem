const UserAuthService = require("../services/UserAuthService");
const CompanyAuthService = require("../services/CompanyAuthService");

module.exports = function (req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(403).json({
      error: "Access denied, token missing",
    });
  }

  try {
    // Try to verify the token as a user first
    const userDecoded = UserAuthService.verifyToken(token);
    req.userId = userDecoded.userId; // Attach userId to the request

    // If it's a user, just move on
    return next();
  } catch (error) {
    // If user token verification fails, try verifying as a company
    try {
      const companyDecoded = CompanyAuthService.verifyToken(token);
      req.companyId = companyDecoded.companyId; // Attach companyId to the request
      return next(); // It's a company, move on
    } catch (error) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
  }
};
