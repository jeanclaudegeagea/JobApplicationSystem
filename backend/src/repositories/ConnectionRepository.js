const mongoose = require("mongoose");
const Connection = require("../models/Connection");

class ConnectionRepository {
  async create(follower, followerType, following, followingType) {
    console.log(follower);
    console.log(following);

    const newConnection = new Connection({
      follower: mongoose.Types.ObjectId.createFromHexString(follower),
      followerType,
      following: mongoose.Types.ObjectId.createFromHexString(following),
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
  async isFollowing(follower, following) {
    return await Connection.findOne({
      follower,
      following,
    }).lean();
  }
}

module.exports = new ConnectionRepository();
