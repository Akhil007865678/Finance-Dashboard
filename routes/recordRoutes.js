// routes/recordRoutes.js
const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord
} = require("../controllers/recordController");

router.post("/", protect, authorize("admin"), createRecord);
router.get("/", protect, authorize("admin", "analyst"), getRecords);
router.put("/:id", protect, authorize("admin"), updateRecord);
router.delete("/:id", protect, authorize("admin"), deleteRecord);

module.exports = router;