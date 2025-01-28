const NotificationRepository = require("../repositories/NotificationRepository");

class NotificationService {
  async sendFollowNotification(notificationData) {
    const { message, following, follower, followerType } = notificationData;

    await NotificationRepository.sendFollowNotification(
      message,
      following,
      follower,
      followerType
    );
  }

  async getUsersNotifications(userId) {
    return await NotificationRepository.getUsersNotifications(userId);
  }

  async readNotification(notificationId) {
    await NotificationRepository.readNotification(notificationId);
  }
}

module.exports = new NotificationService();
