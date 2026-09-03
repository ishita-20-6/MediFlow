const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { uploadPrescription, getPrescription } = require("../controllers/prescriptionController");

router.post("/upload", upload.single("prescriptionImage"), uploadPrescription);
router.get("/:id", getPrescription);

module.exports = router;
