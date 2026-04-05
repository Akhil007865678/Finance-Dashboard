// routes/dashboardRoutes.js
const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getSummary,
  getTrends,
  getRecent
} = require("../controllers/dashboardController");

router.get("/summary", protect, authorize("admin", "analyst"), getSummary);
router.get("/trends", protect, authorize("admin", "analyst"), getTrends);
router.get("/recent", protect, authorize("admin", "analyst"), getRecent);

module.exports = router;