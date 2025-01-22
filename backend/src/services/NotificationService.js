const NotificationRepository = require("../repositories/NotificationRepository");

class NotificationService {
  async sendNotification(notificationData) {
    const { message, following } = notificationData;

    await NotificationRepository.sendNotification(message, following);
  }

  async getUsersNotifications(userId) {
    return await NotificationRepository.getUsersNotifications(userId);
  }

  async readNotification(notificationId) {
    await NotificationRepository.readNotification(notificationId);
  }
}

module.exports = new NotificationService();
