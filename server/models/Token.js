const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    tokenNumber: { type: String, required: true, unique: true },
    prescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Prescription", required: true },
    patientName: { type: String, trim: true },
    counterNumber: { type: Number, required: true },
    items: [
      {
        medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine" },
        name: String,
        quantity: { type: Number, default: 1 },
      },
    ],
    unavailableItems: [{ name: String }], // shown to patient as "not dispensed"
    estimatedWaitMinutes: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["waiting", "called", "serving", "completed", "cancelled"],
      default: "waiting",
    },
    queuePosition: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", tokenSchema);
