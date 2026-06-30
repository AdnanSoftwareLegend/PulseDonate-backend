const express = require("express");
const {
  createDonor,
  deleteDonor,
  getDonor,
  listDonors,
  updateDonor,
} = require("../controllers/donor.controller");
const { requireAuth } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  donorCreateSchema,
  donorIdSchema,
  donorListSchema,
  donorUpdateSchema,
} = require("../schemas/donor.schema");

const router = express.Router();

router.get("/", validate(donorListSchema), listDonors);
router.get("/:id", validate(donorIdSchema), getDonor);
router.post("/", requireAuth, validate(donorCreateSchema), createDonor);
router.patch("/:id", requireAuth, validate(donorUpdateSchema), updateDonor);
router.delete("/:id", requireAuth, validate(donorIdSchema), deleteDonor);

module.exports = router;
