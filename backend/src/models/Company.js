const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Connection = require("./Connection");
const Job = require("./Job");
const Notification = require("./Notification");
const Application = require("./Application");

dotenv.config();

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String, default: "Not specified" }, // Added default value
  industry: { type: String, default: "Not specified" }, // Added default value
  website: { type: String, default: "Not provided" }, // Added default value
  description: { type: String, default: "No description provided" }, // Added default value
  logo: {
    type: String,
    default: `/uploads/images/defaultcompany.png`,
  }, // Added default value
  createdAt: { type: Date, default: Date.now },
});

companySchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.password = undefined;
    return ret;
  },
});

companySchema.pre("findOneAndDelete", async function (next) {
  const companyId = this.getQuery()._id;

  try {
    // Find all jobs belonging to this company
    const jobs = await Job.find({ company: companyId });

    // Extract job IDs
    const jobIds = jobs.map((job) => job._id);

    // Perform all deletions in parallel for better efficiency
    await Promise.all([
      Connection.deleteMany({
        $or: [{ follower: companyId }, { following: companyId }],
      }),
      Job.deleteMany({ company: companyId }),
      Application.deleteMany({ job: { $in: jobIds } }),
      Notification.deleteMany({
        $or: [{ userNotified: companyId }, { fromUser: companyId }],
      }),
    ]);

    next(); // Proceed with deletion
  } catch (error) {
    next(error); // Pass any error to the next middleware
  }
});

module.exports = mongoose.model("Company", companySchema);
