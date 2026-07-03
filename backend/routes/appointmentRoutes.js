const express = require("express");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Notification = require("../models/Notification");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// @route   POST /api/appointments  (patient books an appointment)
router.post("/", protect, authorize("patient"), async (req, res) => {
  try {
    const { doctorId, date, timeSlot, reason } = req.body;

    const doctor = await Doctor.findById(doctorId).populate("user", "name");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date,
      timeSlot,
      reason,
    });

    await Notification.create({
      user: doctor.user._id,
      message: `New appointment request from ${req.user.name} on ${new Date(
        date
      ).toDateString()} at ${timeSlot}`,
      type: "appointment",
      relatedAppointment: appointment._id,
    });

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   GET /api/appointments/my  (patient's own appointments)
router.get("/my", protect, authorize("patient"), async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate({ path: "doctor", populate: { path: "user", select: "name email" } })
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   GET /api/appointments/doctor  (doctor's own appointments)
router.get("/doctor", protect, authorize("doctor"), async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate("patient", "name email phone")
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   PUT /api/appointments/:id/status  (doctor updates status)
router.put("/:id/status", protect, authorize("doctor", "admin"), async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    appointment.status = status;
    await appointment.save();

    await Notification.create({
      user: appointment.patient,
      message: `Your appointment on ${appointment.date.toDateString()} has been ${status}`,
      type: "appointment",
      relatedAppointment: appointment._id,
    });

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   POST /api/appointments/:id/documents  (patient uploads document)
router.post(
  "/:id/documents",
  protect,
  authorize("patient"),
  upload.single("document"),
  async (req, res) => {
    try {
      const appointment = await Appointment.findById(req.params.id);
      if (!appointment) return res.status(404).json({ message: "Appointment not found" });
      if (appointment.patient.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });

      appointment.documents.push({
        fileName: req.file.originalname,
        filePath: `/uploads/${req.file.filename}`,
      });
      await appointment.save();

      res.status(201).json(appointment);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

// @route   DELETE /api/appointments/:id  (patient cancels)
router.delete("/:id", protect, authorize("patient"), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    appointment.status = "cancelled";
    await appointment.save();
    res.json({ message: "Appointment cancelled" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
