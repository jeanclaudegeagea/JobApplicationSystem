const mongoose = require("mongoose");
const Connection = require("../models/Connection");

class ConnectionRepository {
  async create(follower, followerType, following, followingType) {
    const newConnection = new Connection({
      following: mongoose.Types.ObjectId.createFromHexString(follower),
      followerType,
      follower: mongoose.Types.ObjectId.createFromHexString(following),
      followingType,
    });

    await newConnection.save();
  }
  async delete(follower, following) {
    await Connection.findOneAndDelete({
      follower,
      following,
    });
  }
  async getAllFollowers(userId) {
    return await Connection.find({
      following: userId,
    });
  }
  async getAllFollowings(userId) {
    return await Connection.find({
      follower: userId,
    });
  }
}

module.exports = new ConnectionRepository();
