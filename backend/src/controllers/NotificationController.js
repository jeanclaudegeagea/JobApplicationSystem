const NotificationService = require("../services/NotificationService");

class NotificationController {
  async sendFollowNotification(req, res) {
    try {
      const notificationData = req.body;
      await NotificationService.sendFollowNotification(notificationData);
      res.status(201).json({
        message: "Success",
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
  async getUsersNotifications(req, res) {
    try {
      const { userId } = req.params;

      const notifications = await NotificationService.getUsersNotifications(
        userId
      );

      res.status(201).json(notifications);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
  async readNotification(req, res) {
    try {
      const { notificationId } = req.params;

      await NotificationService.readNotification(notificationId);

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
