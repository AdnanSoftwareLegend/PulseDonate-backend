const mongoose = require("mongoose");
const Donor = require("../models/Donor");

function normalizeDonorPayload(data) {
  const payload = {
    fullName: data.fullName || data.name,
    bloodGroup: data.bloodGroup,
    district: data.district,
    phone: data.phone,
    email: data.email || undefined,
    age: data.age,
    gender: data.gender || undefined,
    lastDonationDate: data.lastDonationDate || undefined,
    available: data.available,
    imageUrl: data.imageUrl || data.image || undefined,
    about: data.about || undefined,
  };

  return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));
}

function assertValidObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid donor id");
    error.statusCode = 400;
    throw error;
  }
}

async function listDonors(req, res, next) {
  try {
    const { search, bloodGroup, district, available } = req.validated.query;
    const filter = {};

    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (district) filter.district = district;
    if (typeof available === "boolean") filter.available = available;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { district: { $regex: search, $options: "i" } },
        { bloodGroup: { $regex: search, $options: "i" } },
      ];
    }

    const donors = await Donor.find(filter).sort({ createdAt: -1 });
    res.json(donors);
  } catch (error) {
    next(error);
  }
}

async function getDonor(req, res, next) {
  try {
    assertValidObjectId(req.validated.params.id);
    const donor = await Donor.findById(req.validated.params.id);

    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    return res.json(donor);
  } catch (error) {
    return next(error);
  }
}

async function createDonor(req, res, next) {
  try {
    const donor = await Donor.create({
      ...normalizeDonorPayload(req.validated.body),
      ownerUid: req.user.uid,
    });

    res.status(201).json(donor);
  } catch (error) {
    next(error);
  }
}

async function updateDonor(req, res, next) {
  try {
    assertValidObjectId(req.validated.params.id);
    const donor = await Donor.findById(req.validated.params.id);

    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    if (donor.ownerUid !== req.user.uid && req.user.role !== "admin") {
      return res.status(403).json({ message: "You are not allowed to update this donor" });
    }

    Object.assign(donor, normalizeDonorPayload(req.validated.body));
    await donor.save();

    return res.json(donor);
  } catch (error) {
    return next(error);
  }
}

async function deleteDonor(req, res, next) {
  try {
    assertValidObjectId(req.validated.params.id);
    const donor = await Donor.findById(req.validated.params.id);

    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    if (donor.ownerUid !== req.user.uid && req.user.role !== "admin") {
      return res.status(403).json({ message: "You are not allowed to delete this donor" });
    }

    await donor.deleteOne();
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listDonors,
  getDonor,
  createDonor,
  updateDonor,
  deleteDonor,
};
