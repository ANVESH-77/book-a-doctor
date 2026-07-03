const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["appointment", "system", "reminder"],
      default: "system",
    },
    isRead: { type: Boolean, default: false },
    relatedAppointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
