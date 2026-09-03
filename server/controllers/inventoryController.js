const Medicine = require("../models/Medicine");

async function listMedicines(req, res) {
  const { q } = req.query;
  const filter = q ? { $text: { $search: q } } : {};
  const medicines = await Medicine.find(filter).sort({ name: 1 });
  res.json({ success: true, count: medicines.length, medicines });
}

async function createMedicine(req, res) {
  const medicine = await Medicine.create(req.body);
  res.status(201).json({ success: true, medicine });
}

async function updateMedicine(req, res) {
  const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!medicine) return res.status(404).json({ success: false, message: "Medicine not found" });
  res.json({ success: true, medicine });
}

async function deleteMedicine(req, res) {
  const medicine = await Medicine.findByIdAndDelete(req.params.id);
  if (!medicine) return res.status(404).json({ success: false, message: "Medicine not found" });
  res.json({ success: true, message: "Medicine removed" });
}

/**
 * Quick stock check for a single medicine name — used by the frontend
 * for a manual "check availability" search separate from OCR uploads.
 */
async function checkAvailability(req, res) {
  const { name } = req.query;
  if (!name) return res.status(400).json({ success: false, message: "name query param required" });

  const medicine = await Medicine.findOne({
    $or: [
      { name: new RegExp(name, "i") },
      { genericName: new RegExp(name, "i") },
      { aliases: new RegExp(name, "i") },
    ],
  });

  if (!medicine) {
    return res.json({ success: true, found: false, available: false });
  }

  res.json({
    success: true,
    found: true,
    available: medicine.stockQuantity > 0,
    stockQuantity: medicine.stockQuantity,
    counterNumber: medicine.counterNumber,
    medicine,
  });
}

module.exports = {
  listMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  checkAvailability,
};
