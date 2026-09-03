# MediFlow AI

AI-powered smart pharmacy queue management for government hospitals. Patients
upload a prescription photo; the system OCRs it, matches each line against
live inventory, and issues a token **only** for medicines actually in stock —
so no one queues for something the pharmacy can't give them.

## Quick Start

### 1. Prerequisites
- Node.js 18+
- MongoDB running locally or a connection string (e.g. MongoDB Atlas)

### 2. Backend

```bash
cd server
npm install
cp .env.example .env      # then edit MONGO_URI if needed
npm run seed               # loads sample medicines so you have data to test with
npm run dev                 # starts on http://localhost:5000
```

### 3. Frontend

```bash
cd client
npm install
npm run dev                 # starts on http://localhost:5173, proxies /api to :5000
```

Open `http://localhost:5173`, upload a prescription image, review detected
medicines, and generate a token.

## How Matching Works

1. **OCR** — `Tesseract.js` runs locally (no API key, no external calls needed),
   extracting raw text lines from the uploaded image.
2. **Cleaning** — dosage/frequency noise ("500mg", "1-0-1", "tab") is stripped
   from each line (`services/medicineMatcher.js`).
3. **Fuzzy match** — the cleaned line is compared against every medicine's
   `name`, `genericName`, and `aliases` using Dice-coefficient string
   similarity (`string-similarity`). Matches below a 0.45 threshold are
   flagged as unrecognized rather than guessed.
4. **Stock check** — matched medicines are marked available/unavailable from
   live `stockQuantity`.
5. **Token generation** — only available items are included; stock is
   decremented transactionally so two patients can't both be issued the last
   unit. The counter with the most of the patient's items is auto-selected,
   and wait time is estimated from how many items are already queued there.

## Swapping OCR/AI providers

- To use **OCR.Space** instead of local Tesseract, set `OCR_SPACE_API_KEY` in
  `.env` and swap the implementation in `server/services/ocrService.js`.
- To use **OpenAI** for smarter name normalization (handling messier
  handwriting-derived OCR output), set `OPENAI_API_KEY` and extend
  `medicineMatcher.js` to call it before the fuzzy-match fallback.

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/prescriptions/upload` | Upload prescription image (`multipart/form-data`, field `prescriptionImage`), runs OCR + matching |
| GET | `/api/prescriptions/:id` | Fetch a processed prescription |
| POST | `/api/tokens/generate/:prescriptionId` | Generate a token for available items only |
| GET | `/api/tokens/:id` | Get token details (used for live status polling) |
| GET | `/api/tokens/queue/:counterNumber` | Current queue at a counter |
| PATCH | `/api/tokens/:id/status` | Advance token status (`waiting`→`called`→`serving`→`completed`) |
| GET | `/api/inventory` | List/search medicines (`?q=`) |
| GET | `/api/inventory/check?name=` | Quick single-medicine availability check |
| POST/PUT/DELETE | `/api/inventory[/:id]` | Manage catalog (pharmacist/admin use) |

## Project Structure

```
mediflow-ai/
├── client/                 # React + Tailwind frontend
│   └── src/
│       ├── api/            # axios calls to backend
│       ├── components/     # PrescriptionUpload, TokenCard, MedicineStatusList
│       └── pages/          # Home, TokenStatus
├── server/                  # Node/Express backend
│   ├── controllers/         # prescription, inventory, token logic
│   ├── models/               # Medicine, Prescription, Token, Counter
│   ├── routes/
│   ├── services/             # ocrService, medicineMatcher, waitTimeService
│   └── middleware/upload.js  # multer image upload
└── database/seed.js         # sample medicine data
```

## Known limitations / next steps

- Quantity per medicine is currently assumed to be 1 unit per matched line —
  extend OCR parsing to capture prescribed quantity/duration for accurate
  decrements.
- Handwritten prescriptions are the hardest case for OCR; the doctor
  handwriting recognition item in the roadmap would likely need a
  fine-tuned model rather than general OCR.
- No auth/role system yet (patient vs pharmacist vs admin) — add before any
  real deployment, especially given this handles patient health data.
- Add rate limiting and stricter file validation before exposing the upload
  endpoint publicly.

## License

MIT
