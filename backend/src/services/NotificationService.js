const NotificationRepository = require("../repositories/NotificationRepository");

class NotificationService {
  async sendNotification(notificationData) {
    const { message, following } = notificationData;

    await NotificationRepository.sendNotification(message, following);
  }
}

module.exports = new NotificationService();
