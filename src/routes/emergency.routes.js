const express = require("express");
const {
  createEmergencyRequest,
  getEmergencyRequest,
  listEmergencyRequests,
} = require("../controllers/emergency.controller");
const validate = require("../middleware/validate");
const { emergencyCreateSchema, emergencyIdSchema } = require("../schemas/emergency.schema");

const router = express.Router();

router.get("/", listEmergencyRequests);
router.get("/:id", validate(emergencyIdSchema), getEmergencyRequest);
router.post("/", validate(emergencyCreateSchema), createEmergencyRequest);

module.exports = router;
