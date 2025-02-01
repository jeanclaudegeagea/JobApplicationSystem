const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Connection = require("./Connection"); // Import the Connection model
const Notification = require("./Notification");

dotenv.config();

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, default: null },
  description: { type: String, default: "No description provided" }, // Added default value
});

const universitySchema = new mongoose.Schema({
  universityName: { type: String, required: true },
  major: { type: String, required: true },
  degree: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, default: null }, // Added default value
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String, default: "Not specified" }, // Added default value
  experience: [experienceSchema],
  profilePicture: {
    type: String,
    default: "/uploads/images/defaultuser.png",
  }, // Added default value
  university: [universitySchema],
  cv: { type: String, default: "No CV uploaded" }, // Added default value
  createdAt: { type: Date, default: Date.now },
});

userSchema.methods.isProfileComplete = function () {
  return (
    this.name &&
    this.email &&
    this.phoneNumber &&
    this.location !== "Not specified" &&
    this.profilePicture !== "default_profile_picture_url" &&
    this.cv !== "No CV uploaded"
  );
};

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.password = undefined;
    return ret;
  },
});

userSchema.pre("findOneAndDelete", async function (next) {
  const userId = this.getQuery()._id;

  try {
    // Delete related connections
    await Connection.deleteMany({
      $or: [{ follower: userId }, { following: userId }],
    });

    // Find the user being deleted
    const user = await this.model.findOne(this.getFilter());
    if (user) {
      // Delete related applications
      await mongoose.model("Application").deleteMany({ user: user._id });
    }

    await Notification.deleteMany({
      $or: [{ userNotified: userId }, { fromUser: userId }],
    });

    next(); // Proceed with deletion
  } catch (error) {
    next(error); // Pass any error to the next middleware
  }
});

module.exports = mongoose.model("User", userSchema);
