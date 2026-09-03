const Tesseract = require("tesseract.js");

/**
 * Runs OCR on an uploaded prescription image and returns raw text
 * plus a naive line-split (one candidate medicine per line).
 *
 * Swap this out for OCR.Space by checking process.env.OCR_SPACE_API_KEY
 * if you'd rather not run OCR locally (Tesseract.js works fully offline,
 * which is why it's the default for a hospital deployment with patchy internet).
 */
async function extractTextFromImage(imagePath) {
  const {
    data: { text },
  } = await Tesseract.recognize(imagePath, "eng", {
    logger: () => {}, // swap for a real logger/progress callback if needed
  });

  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 2) // drop empty/near-empty noise lines
    .filter((l) => !/^dr\.?\s/i.test(l)) // skip "Dr. XYZ" header lines
    .filter((l) => !/^date[:\s]/i.test(l));

  return { rawText: text, lines };
}

module.exports = { extractTextFromImage };
