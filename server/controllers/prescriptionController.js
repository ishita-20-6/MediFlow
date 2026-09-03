const Prescription = require("../models/Prescription");
const { extractTextFromImage } = require("../services/ocrService");
const { matchLinesToMedicines } = require("../services/medicineMatcher");

/**
 * POST /api/prescriptions/upload
 * Accepts an image upload, runs OCR, fuzzy-matches each line against
 * the medicine catalog, and stores the result. Does NOT generate a
 * token yet — that's a separate confirm step so the patient/pharmacist
 * can review what was detected first.
 */
async function uploadPrescription(req, res) {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No prescription image uploaded" });
  }

  const prescription = await Prescription.create({
    patientName: req.body.patientName,
    patientPhone: req.body.patientPhone,
    imagePath: req.file.path,
    status: "processing",
  });

  try {
    const { rawText, lines } = await extractTextFromImage(req.file.path);
    const matchedItems = await matchLinesToMedicines(lines);

    prescription.ocrRawText = rawText;
    prescription.extractedItems = matchedItems;
    prescription.status = "processed";
    await prescription.save();

    return res.status(201).json({ success: true, prescription });
  } catch (err) {
    prescription.status = "failed";
    prescription.errorMessage = err.message;
    await prescription.save();
    return res.status(500).json({ success: false, message: "OCR processing failed", error: err.message });
  }
}

async function getPrescription(req, res) {
  const prescription = await Prescription.findById(req.params.id);
  if (!prescription) {
    return res.status(404).json({ success: false, message: "Prescription not found" });
  }
  res.json({ success: true, prescription });
}

module.exports = { uploadPrescription, getPrescription };
