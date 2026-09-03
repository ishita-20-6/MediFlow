const mongoose = require("mongoose");

/**
 * Medicine inventory item.
 * `aliases` lets OCR/fuzzy-matching hit brand names, misspellings,
 * or shorthand a doctor's prescription might use.
 */
const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    genericName: { type: String, trim: true },
    aliases: [{ type: String, trim: true }],
    stockQuantity: { type: Number, required: true, default: 0, min: 0 },
    unit: { type: String, default: "units" }, // strip, bottle, tablet, etc.
    counterNumber: { type: Number, required: true, default: 1 },
    reorderThreshold: { type: Number, default: 10 },
    lastRestocked: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

medicineSchema.index({ name: "text", genericName: "text", aliases: "text" });

medicineSchema.virtual("inStock").get(function () {
  return this.stockQuantity > 0;
});

module.exports = mongoose.model("Medicine", medicineSchema);
