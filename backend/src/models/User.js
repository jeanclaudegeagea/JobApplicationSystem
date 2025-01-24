const mongoose = require("mongoose");

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
  profilePicture: { type: String, default: "default_profile_picture_url" }, // Added default value
  university: [universitySchema],
  cv: { type: String, default: "No CV uploaded" }, // Added default value
  createdAt: { type: Date, default: Date.now },
});

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.password = undefined;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
