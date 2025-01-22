const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["Applied", "Under Review", "Shortlisted", "Rejected", "Accepted"],
    default: "Applied",
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  companyFeedback: {
    type: String,
  },
});

module.exports = mongoose.model("Application", applicationSchema);
