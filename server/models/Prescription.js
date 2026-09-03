const mongoose = require("mongoose");

const extractedItemSchema = new mongoose.Schema(
  {
    rawText: { type: String },              // raw OCR line
    matchedMedicineName: { type: String },  // best-matched catalog name
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine" },
    confidence: { type: Number, default: 0 }, // 0-1 fuzzy match score
    available: { type: Boolean, default: false },
    stockQuantity: { type: Number, default: 0 },
  },
  { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
  {
    patientName: { type: String, trim: true },
    patientPhone: { type: String, trim: true },
    imagePath: { type: String, required: true },
    ocrRawText: { type: String },
    extractedItems: [extractedItemSchema],
    status: {
      type: String,
      enum: ["processing", "processed", "failed"],
      default: "processing",
    },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
