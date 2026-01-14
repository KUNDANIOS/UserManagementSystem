const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    desc: String,
    done: { type: Boolean, default: false }
  },
  { timestamps: true }   // adds createdAt, updatedAt
);

module.exports = mongoose.model("Activity", activitySchema);
