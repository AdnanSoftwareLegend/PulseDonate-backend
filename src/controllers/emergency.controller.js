const mongoose = require("mongoose");
const EmergencyRequest = require("../models/EmergencyRequest");

function assertValidObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid emergency request id");
    error.statusCode = 400;
    throw error;
  }
}

async function listEmergencyRequests(req, res, next) {
  try {
    const requests = await EmergencyRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    next(error);
  }
}

async function getEmergencyRequest(req, res, next) {
  try {
    assertValidObjectId(req.validated.params.id);
    const request = await EmergencyRequest.findById(req.validated.params.id);

    if (!request) {
      return res.status(404).json({ message: "Emergency request not found" });
    }

    return res.json(request);
  } catch (error) {
    return next(error);
  }
}

async function createEmergencyRequest(req, res, next) {
  try {
    const request = await EmergencyRequest.create(req.validated.body);
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listEmergencyRequests,
  getEmergencyRequest,
  createEmergencyRequest,
};
