const express = require("express");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/doctors  (public - browse/search doctors)
router.get("/", async (req, res) => {
  try {
    const { specialization, search } = req.query;
    const filter = { isApproved: true };

    if (specialization) {
      filter.specialization = { $regex: specialization, $options: "i" };
    }

    let doctors = await Doctor.find(filter).populate("user", "name email avatar phone");

    if (search) {
      const regex = new RegExp(search, "i");
      doctors = doctors.filter(
        (d) => regex.test(d.user?.name || "") || regex.test(d.specialization)
      );
    }

    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   GET /api/doctors/:id
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      "user",
      "name email avatar phone"
    );
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   PUT /api/doctors/profile  (doctor updates own profile)
router.put("/profile/update", protect, authorize("doctor"), async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate({ user: req.user._id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   PUT /api/doctors/:id/approve  (admin only)
router.put("/:id/approve", protect, authorize("admin"), async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   GET /api/doctors/admin/all  (admin - list all doctors incl. unapproved)
router.get("/admin/all", protect, authorize("admin"), async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("user", "name email phone isActive");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
