const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  fromCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  message: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
