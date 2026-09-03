# Deploying MediFlow AI

This app has two deployable pieces: the **backend** (Express API + OCR) and
the **frontend** (React static site). Deploy them separately.

## 1. Database — MongoDB Atlas (free tier works)
1. Create a cluster at https://www.mongodb.com/cloud/atlas.
2. Create a database user + password.
3. Under Network Access, allow access from anywhere (`0.0.0.0/0`) or your
   host's IP range.
4. Copy the connection string — this is your `MONGO_URI`.

## 2. Backend — Render, Railway, or Fly.io (NOT Vercel/Netlify serverless)

OCR (Tesseract.js) takes a few seconds per image and needs a persistent
process, so deploy this as a **regular web service**, not a serverless
function with a short timeout.

Example using **Render**:
1. Push this repo to GitHub.
2. New → Web Service → connect the repo, set root directory to `server`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables (from `server/.env.example`):
   - `MONGO_URI` — your Atlas connection string
   - `PORT` — Render sets this automatically, but keep the fallback in code
   - `CLIENT_URL` — fill this in after you deploy the frontend (step 3)
   - `AVG_SERVICE_MINUTES_PER_ITEM` — optional, defaults to 2
6. Deploy. Note the resulting URL, e.g. `https://mediflow-api.onrender.com`.
7. Seed sample data once, either by running `npm run seed` locally against
   your Atlas URI, or via the host's shell/console.

### ⚠️ Uploaded images won't persist
`multer` currently saves prescription images to `server/uploads/` on local
disk. Render, Railway, and most PaaS platforms wipe local disk on every
redeploy/restart — fine for a demo, not for real patient data. Before a real
deployment, switch `middleware/upload.js` to upload to S3, Cloudinary, or
similar object storage instead of `diskStorage`. Say the word and I can wire
that in.

## 3. Frontend — Vercel or Netlify
1. New project → import the same repo → root directory `client`.
2. Build command: `npm run build`, output directory: `dist`.
3. Add environment variable `VITE_API_URL` = `https://mediflow-api.onrender.com/api`
   (your backend URL from step 2, with `/api` on the end).
4. Deploy. Note the resulting URL, e.g. `https://mediflow.vercel.app`.
5. Go back to your backend's env vars and set `CLIENT_URL` to this frontend
   URL, then redeploy the backend so CORS allows it.

## 4. Sanity check
- Visit `https://your-backend-url/api/health` — should return
  `{"success":true,...}`.
- Visit your frontend URL, upload a test prescription image, confirm it
  reaches the backend (check the Network tab if it fails — CORS or wrong
  `VITE_API_URL` are the usual culprits).

## Checklist before calling it "production ready"
- [ ] Switch uploads from local disk to cloud storage (S3/Cloudinary)
- [ ] Add authentication (patient/pharmacist/admin roles)
- [ ] Restrict CORS to your real frontend domain (`CLIENT_URL`)
- [ ] Add rate limiting on `/api/prescriptions/upload`
- [ ] Review MongoDB Atlas network access rules (don't leave `0.0.0.0/0` long-term)
- [ ] Decide a real data-retention policy for prescription images (patient health data)
