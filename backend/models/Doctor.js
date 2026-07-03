const mongoose = require("mongoose");

const availabilitySlotSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      required: true,
    },
    startTime: { type: String, required: true }, // e.g. "09:00"
    endTime: { type: String, required: true }, // e.g. "17:00"
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    specialization: { type: String, required: true, trim: true },
    qualifications: { type: String, trim: true },
    experienceYears: { type: Number, default: 0 },
    bio: { type: String, trim: true },
    consultationFee: { type: Number, default: 0 },
    clinicAddress: { type: String, trim: true },
    availability: [availabilitySlotSchema],
    rating: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
