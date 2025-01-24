const UserAuthService = require("../services/UserAuthService");

module.exports = function (req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(403).json({
      error: "Access denied",
    });
  }

  try {
    const decoded = UserAuthService.verifyToken(token);

    if (!decoded.userId) {
      return res
        .status(403)
        .json({ error: "Access denied, incorrect role (user expected)" });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({
      error: "Session expired",
    });
  }
};
