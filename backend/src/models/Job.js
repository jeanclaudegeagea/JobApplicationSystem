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

jobSchema.pre("findOneAndDelete", async function (next) {
  try {
    const job = await this.model.findOne(this.getFilter()); // Get the job being deleted
    if (job) {
      await mongoose.model("Application").deleteMany({ job: job._id });
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Job", jobSchema);
