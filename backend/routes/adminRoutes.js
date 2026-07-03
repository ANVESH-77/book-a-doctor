const express = require("express");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect, authorize("admin"));

// @route   GET /api/admin/users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   PUT /api/admin/users/:id/deactivate
router.put("/users/:id/deactivate", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   GET /api/admin/appointments
router.get("/appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email")
      .populate({ path: "doctor", populate: { path: "user", select: "name email" } })
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   GET /api/admin/stats
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalDoctors = await User.countDocuments({ role: "doctor" });
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: "pending" });

    res.json({
      totalUsers,
      totalPatients,
      totalDoctors,
      totalAppointments,
      pendingAppointments,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
