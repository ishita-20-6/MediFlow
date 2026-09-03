const mongoose = require("mongoose");
const Prescription = require("../models/Prescription");
const Medicine = require("../models/Medicine");
const Token = require("../models/Token");
const { estimateWaitMinutes } = require("../services/waitTimeService");

async function generateTokenNumber() {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const countToday = await Token.countDocuments({
    createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
  });
  return `MF-${today}-${String(countToday + 1).padStart(3, "0")}`;
}

/**
 * Picks the counter to allocate the token to: the counter that
 * handles the most of this patient's available medicines wins,
 * so the patient ideally visits one counter, not several.
 */
function pickCounter(availableItems) {
  const counts = {};
  for (const item of availableItems) {
    const c = item.counterNumber || 1;
    counts[c] = (counts[c] || 0) + 1;
  }
  const entries = Object.entries(counts);
  if (entries.length === 0) return 1;
  entries.sort((a, b) => b[1] - a[1]);
  return Number(entries[0][0]);
}

/**
 * POST /api/tokens/generate/:prescriptionId
 * Generates a token ONLY for medicines confirmed available in stock.
 * Unavailable items are listed separately so the patient/pharmacist
 * knows what wasn't dispensed. Reserves stock immediately to avoid
 * double-allocating the last units to two patients at once.
 */
async function generateToken(req, res) {
  const prescription = await Prescription.findById(req.params.prescriptionId);
  if (!prescription) {
    return res.status(404).json({ success: false, message: "Prescription not found" });
  }
  if (prescription.status !== "processed") {
    return res.status(400).json({ success: false, message: "Prescription not yet processed" });
  }

  const availableItems = prescription.extractedItems.filter((i) => i.available && i.medicineId);
  const unavailableItems = prescription.extractedItems.filter((i) => !i.available || !i.medicineId);

  if (availableItems.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No available medicines to generate a token for",
      unavailableItems: unavailableItems.map((i) => ({ name: i.rawText })),
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Reserve stock (decrement by 1 unit per matched item — adjust to
    // real prescribed quantities once OCR captures dosage counts).
    for (const item of availableItems) {
      const updated = await Medicine.findOneAndUpdate(
        { _id: item.medicineId, stockQuantity: { $gt: 0 } },
        { $inc: { stockQuantity: -1 } },
        { new: true, session }
      );
      if (!updated) {
        throw new Error(`${item.matchedMedicineName} went out of stock while generating your token`);
      }
    }

    const counterNumber = pickCounter(availableItems);
    const { estimatedWaitMinutes, queuePosition } = await estimateWaitMinutes(
      counterNumber,
      availableItems.length
    );
    const tokenNumber = await generateTokenNumber();

    const [token] = await Token.create(
      [
        {
          tokenNumber,
          prescriptionId: prescription._id,
          patientName: prescription.patientName,
          counterNumber,
          items: availableItems.map((i) => ({
            medicineId: i.medicineId,
            name: i.matchedMedicineName,
            quantity: 1,
          })),
          unavailableItems: unavailableItems.map((i) => ({ name: i.rawText })),
          estimatedWaitMinutes,
          queuePosition,
          status: "waiting",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({ success: true, token });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res.status(409).json({ success: false, message: err.message });
  }
}

async function getToken(req, res) {
  const token = await Token.findById(req.params.id).populate("items.medicineId");
  if (!token) return res.status(404).json({ success: false, message: "Token not found" });
  res.json({ success: true, token });
}

/**
 * GET /api/tokens/queue/:counterNumber
 * Live queue for a counter — what a counter-side display screen would poll.
 */
async function getCounterQueue(req, res) {
  const counterNumber = Number(req.params.counterNumber);
  const tokens = await Token.find({
    counterNumber,
    status: { $in: ["waiting", "called", "serving"] },
  }).sort({ createdAt: 1 });
  res.json({ success: true, counterNumber, count: tokens.length, tokens });
}

/**
 * PATCH /api/tokens/:id/status
 * Pharmacy staff advance a token through waiting -> called -> serving -> completed.
 */
async function updateTokenStatus(req, res) {
  const { status } = req.body;
  const allowed = ["waiting", "called", "serving", "completed", "cancelled"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ success: false, message: `status must be one of: ${allowed.join(", ")}` });
  }
  const token = await Token.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!token) return res.status(404).json({ success: false, message: "Token not found" });
  res.json({ success: true, token });
}

module.exports = { generateToken, getToken, getCounterQueue, updateTokenStatus };
