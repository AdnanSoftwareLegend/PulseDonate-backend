const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema(
  {
    ownerUid: {
      type: String,
      required: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    bloodGroup: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    age: {
      type: Number,
      min: 18,
      max: 65,
    },
    gender: {
      type: String,
      trim: true,
    },
    lastDonationDate: {
      type: Date,
    },
    available: {
      type: Boolean,
      default: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    about: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id.toString();
        ret.name = ret.fullName;
        ret.image = ret.imageUrl;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

donorSchema.index({ fullName: "text", district: "text", bloodGroup: "text" });

module.exports = mongoose.model("Donor", donorSchema);
