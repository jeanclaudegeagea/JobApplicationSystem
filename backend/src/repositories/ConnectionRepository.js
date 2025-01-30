const mongoose = require("mongoose");
const Connection = require("../models/Connection");
const User = require("../models/User");
const Company = require("../models/Company");

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
    const result = await Connection.find({
      following: userId,
    });

    const mappedResult = await Promise.all(
      result.map(async (followerData) => {
        const { follower, followerType } = followerData;

        let data;

        if (followerType === "User") {
          data = await User.findById(follower);
        } else if (followerType === "Company") {
          data = await Company.findById(follower);
        }

        return {
          ...followerData.toObject(), // Convert Mongoose document to plain object
          ...data?.toObject(),
        };
      })
    );

    return mappedResult;
  }
  async getAllFollowings(userId) {
    const result = await Connection.find({
      follower: userId,
    });

    const mappedResult = await Promise.all(
      result.map(async (followingData) => {
        const { following, followingType } = followingData;

        let data;

        if (followingType === "User") {
          data = await User.findById(following);
        } else if (followingType === "Company") {
          data = await Company.findById(following);
        }

        return {
          ...followingData.toObject(), // Convert Mongoose document to plain object
          ...data?.toObject(),
        };
      })
    );

    return mappedResult;
  }
  async isFollowing(follower, following) {
    return await Connection.findOne({
      follower,
      following,
    }).lean();
  }
}

module.exports = new ConnectionRepository();
