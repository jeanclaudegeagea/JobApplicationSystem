const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  userNotified: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "fromUserType", // Dynamic reference
  },
  fromUserType: {
    type: String,
    required: true,
    enum: ["User", "Company"], // Add all possible model names
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
