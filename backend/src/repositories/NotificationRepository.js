const Notification = require("../models/Notification");

class NotificationRepository {
  async sendNotification(message, following) {
    const newNotification = new Notification({
      message,
      userNotified: following,
    });

    await newNotification.save();
  }
}

module.exports = new NotificationRepository();
