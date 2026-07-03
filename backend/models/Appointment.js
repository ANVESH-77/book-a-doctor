const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true }, // e.g. "10:00 - 10:30"
    reason: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    documents: [
      {
        fileName: String,
        filePath: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
