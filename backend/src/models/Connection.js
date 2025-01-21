const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ["User", "Company"], // Array of possible references
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ["User", "Company"], // Array of possible references
  },
});

module.exports = mongoose.model("Connection", connectionSchema);
