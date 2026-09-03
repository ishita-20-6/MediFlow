const express = require("express");
const router = express.Router();
const {
  generateToken,
  getToken,
  getCounterQueue,
  updateTokenStatus,
} = require("../controllers/tokenController");

router.post("/generate/:prescriptionId", generateToken);
router.get("/queue/:counterNumber", getCounterQueue);
router.get("/:id", getToken);
router.patch("/:id/status", updateTokenStatus);

module.exports = router;
