const stringSimilarity = require("string-similarity");
const Medicine = require("../models/Medicine");

const MATCH_THRESHOLD = 0.45; // below this, we treat the line as unrecognized

/**
 * Strips dosage/frequency noise from an OCR line so what's left is
 * closer to just the medicine name, e.g.
 * "Paracetamol 500mg 1-0-1 x 5 days" -> "Paracetamol"
 */
function cleanLine(line) {
  return line
    .replace(/\b\d+\s?(mg|mcg|ml|g|iu)\b/gi, "")
    .replace(/\b\d+[-x]\d+[-x]?\d*\b/gi, "")
    .replace(/\b(tab|tabs|tablet|cap|capsule|syrup|inj|injection|od|bd|tds|qid|sos)\b/gi, "")
    .replace(/[^a-zA-Z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Matches a single OCR line against the medicine catalog using fuzzy
 * string matching across name, genericName, and aliases.
 */
async function matchLineToMedicine(rawLine) {
  const cleaned = cleanLine(rawLine);
  if (!cleaned) return null;

  const catalog = await Medicine.find({}, "name genericName aliases stockQuantity counterNumber");
  if (catalog.length === 0) return null;

  let best = { medicine: null, score: 0, matchedOn: "" };

  for (const med of catalog) {
    const candidates = [med.name, med.genericName, ...(med.aliases || [])].filter(Boolean);
    for (const candidate of candidates) {
      const score = stringSimilarity.compareTwoStrings(cleaned.toLowerCase(), candidate.toLowerCase());
      if (score > best.score) {
        best = { medicine: med, score, matchedOn: candidate };
      }
    }
  }

  if (best.score < MATCH_THRESHOLD) return null;

  return {
    rawText: rawLine,
    matchedMedicineName: best.medicine.name,
    medicineId: best.medicine._id,
    confidence: Number(best.score.toFixed(2)),
    available: best.medicine.stockQuantity > 0,
    stockQuantity: best.medicine.stockQuantity,
    counterNumber: best.medicine.counterNumber,
  };
}

/**
 * Matches every OCR-extracted line to the medicine catalog.
 * Lines with no confident match are still returned (available: false)
 * so the patient/pharmacist can see what wasn't recognized.
 */
async function matchLinesToMedicines(lines) {
  const results = [];
  for (const line of lines) {
    const match = await matchLineToMedicine(line);
    if (match) {
      results.push(match);
    } else {
      results.push({
        rawText: line,
        matchedMedicineName: null,
        medicineId: null,
        confidence: 0,
        available: false,
        stockQuantity: 0,
      });
    }
  }
  return results;
}

module.exports = { matchLineToMedicine, matchLinesToMedicines, cleanLine };
