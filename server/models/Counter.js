const mongoose = require("mongoose");

/**
 * A physical pharmacy dispensing counter.
 * Used for load-based counter allocation and wait-time estimation.
 */
const counterSchema = new mongoose.Schema(
  {
    counterNumber: { type: Number, required: true, unique: true },
    name: { type: String, default: "General" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Counter", counterSchema);
