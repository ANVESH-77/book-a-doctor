const express = require("express");
const Notification = require("../models/Notification");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/notifications  (current user's notifications)
router.get("/", protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   PUT /api/notifications/:id/read
router.put("/:id/read", protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   PUT /api/notifications/read-all
router.put("/read-all", protect, async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
