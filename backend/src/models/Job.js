const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  location: { type: String, required: true },
  salaryRange: { type: String, default: null },
  skillsRequired: [{ type: String, default: null }],
  experienceRequired: { type: String, default: null },
  jobType: {
    type: String,
    enum: ["Full-Time", "Part-Time", "Contract"],
    default: "Full-Time",
  },
  postedAt: { type: Date, default: Date.now },
  closingDate: { type: Date },
});

module.exports = mongoose.model("Job", jobSchema);
