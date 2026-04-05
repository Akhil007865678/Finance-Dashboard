// routes/userRoutes.js
const router = require("express").Router();
const { getUsers, updateRole, toggleStatus } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.get("/", protect, authorize("admin"), getUsers);
router.put("/:id", protect, authorize("admin"), updateRole);
router.patch("/status/:id", protect, authorize("admin"), toggleStatus);

module.exports = router;