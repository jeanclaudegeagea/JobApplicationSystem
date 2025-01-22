const Notification = require("../models/Notification");

class NotificationRepository {
  async sendNotification(message, following) {
    const newNotification = new Notification({
      message,
      userNotified: following,
    });

    await newNotification.save();
  }

  async getUsersNotifications(userId) {
    return await Notification.find({
      userNotified: userId,
    });
  }

  async readNotification(notificationId) {
    await Notification.findByIdAndUpdate(notificationId, {
      isRead: true,
    });
  }
}

module.exports = new NotificationRepository();
