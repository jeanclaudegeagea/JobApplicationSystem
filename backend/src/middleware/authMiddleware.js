const AuthService = require("../services/AuthService");

module.exports = function (req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(403).json({
      error: "Access denied",
    });
  }

  try {
    const decoded = AuthService.verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({
      error: "Session expired",
    });
  }
};
