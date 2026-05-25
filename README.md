# MediFlow AI

MediFlow AI is an AI-powered smart pharmacy queue management system designed for government hospitals to reduce unnecessary waiting time at medicine counters.

The system scans prescriptions using OCR and AI, checks medicine availability in real-time, and generates smart tokens only for available medicines.

---

## Problem Statement

In many government hospitals, patients wait in long pharmacy queues only to discover that their prescribed medicines are unavailable.

This leads to:
- Wasted patient time
- Increased crowding
- Inefficient token management
- Additional workload for pharmacy staff

MediFlow AI aims to solve this problem using AI, OCR, and real-time inventory checking.

---

## Features

- Prescription image upload
- OCR-based medicine extraction
- AI-assisted medicine name recognition
- Real-time medicine stock checking
- Smart token generation
- Counter allocation system
- Estimated wait-time prediction
- Unavailable medicine alerts

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### AI / OCR
- OCR.Space API / Tesseract OCR
- OpenAI API (optional)

---

## Project Workflow

```text
Patient Uploads Prescription
            ↓
OCR Extracts Medicine Names
            ↓
AI Processes Prescription Data
            ↓
System Checks Medicine Inventory
            ↓
Token Generated Only If Medicines Available
            ↓
Patient Receives Counter & Wait Time
```

---

## Folder Structure

```text
mediFlow-ai/
│
├── client/
│   ├── src/
│   ├── public/
│
├── server/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── uploads/
│
├── database/
│
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/mediFlow-ai.git
```

### Navigate to Project

```bash
cd mediFlow-ai
```

---

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## Backend Setup

```bash
cd server
npm install
npm start
```

---

## Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=5000
MONGO_URI=your_mongodb_uri
OCR_API_KEY=your_ocr_api_key
OPENAI_API_KEY=your_openai_api_key
```

---

## Future Enhancements

- Doctor handwriting recognition
- Multi-hospital medicine tracking
- WhatsApp/SMS notifications
- Voice assistant support
- AI-based stock prediction
- Emergency patient prioritization

---

## Use Cases

- Government hospitals
- Public healthcare centers
- OPD pharmacy counters
- Smart healthcare queue systems

---

## Impact

MediFlow AI helps:
- Reduce patient waiting time
- Minimize unnecessary queues
- Improve pharmacy workflow
- Increase hospital efficiency

---

## Contributors

Developed by:
Your Name

---

## License

This project is licensed under the MIT License.
