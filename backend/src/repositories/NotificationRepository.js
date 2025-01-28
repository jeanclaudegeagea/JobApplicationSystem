const Notification = require("../models/Notification");
const User = require("../models/User");
const Company = require("../models/Company");

class NotificationRepository {
  async sendFollowNotification(message, following, follower, followerType) {
    const newNotification = new Notification({
      message,
      userNotified: following,
      fromUser: follower,
      fromUserType: followerType,
    });

    await newNotification.save();
  }

  async getUsersNotifications(userId) {
    const notifications = await Notification.find({ userNotified: userId });

    const mappedNotifications = await Promise.all(
      notifications.map(async (notification) => {
        const { fromUser, fromUserType } = notification;
        let data = null;

        if (fromUserType === "User") {
          data = await User.findById(fromUser);
        } else if (fromUserType === "Company") {
          data = await Company.findById(fromUser);
        }

        return {
          ...notification.toObject(), // Convert Mongoose document to plain object
          logo: data?.profilePicture || data?.logo || null,
        };
      })
    );

    return mappedNotifications;
  }

  async readNotification(notificationId) {
    await Notification.findByIdAndUpdate(notificationId, {
      isRead: true,
    });
  }
}

module.exports = new NotificationRepository();
