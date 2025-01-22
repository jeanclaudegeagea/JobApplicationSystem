const NotificationService = require("../services/NotificationService");

class NotificationController {
  async sendNotification(req, res) {
    try {
      const notificationData = req.body;
      await NotificationService.sendNotification(notificationData);
      res.status(201).json({
        message: "Success",
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
}

module.exports = new NotificationController();
