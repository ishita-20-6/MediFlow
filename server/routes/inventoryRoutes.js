const express = require("express");
const router = express.Router();
const {
  listMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  checkAvailability,
} = require("../controllers/inventoryController");

router.get("/", listMedicines);
router.get("/check", checkAvailability);
router.post("/", createMedicine);
router.put("/:id", updateMedicine);
router.delete("/:id", deleteMedicine);

module.exports = router;
