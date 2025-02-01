const mongoose = require("mongoose");
const Connection = require("../models/Connection");
const User = require("../models/User");
const Company = require("../models/Company");
const Job = require("../models/Job");

class ConnectionRepository {
  async create(follower, followerType, following, followingType) {
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

  async getJobsFromFollowedCompanies(userId) {
    // Fetch all companies the user follows
    const companiesFollowed = await Connection.find({
      follower: userId,
      followingType: "Company",
    });

    // Fetch jobs for each followed company
    const mappedJobs = await Promise.all(
      companiesFollowed.map(async (companyFollowed) => {
        const { following } = companyFollowed;

        // Get company details
        const companyData = await Company.findById(following);
        if (!companyData) return null; // Skip if company doesn't exist

        // Get jobs posted by the company
        const companyJobs = await Job.find({ company: following });

        // Map each job with the required format
        return companyJobs.map((job) => ({
          text: `${companyData.name} created a job at ${new Date(
            job.postedAt
          ).toLocaleDateString()}`,
          companyLogo: companyData.logo, // Assuming company has a logo field
        }));
      })
    );

    // Flatten the array and filter out null values
    return mappedJobs.flat().filter(Boolean);
  }
}

module.exports = new ConnectionRepository();
