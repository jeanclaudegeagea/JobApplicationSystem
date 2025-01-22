const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "followerType",
  },
  followerType: {
    type: String,
    enum: ["User", "Company"],
    required: true,
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "followingType",
  },
  followingType: {
    type: String,
    enum: ["User", "Company"],
    required: true,
  },
});

module.exports = mongoose.model("Connection", connectionSchema);
