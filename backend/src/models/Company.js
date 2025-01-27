const mongoose = require("mongoose");

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
    default: "http://localhost:5000/uploads/images/defaultcompany.png",
  }, // Added default value
  createdAt: { type: Date, default: Date.now },
});

companySchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.password = undefined;
    return ret;
  },
});

module.exports = mongoose.model("Company", companySchema);
