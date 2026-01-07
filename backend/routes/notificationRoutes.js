const express = require("express");
const router = express.Router();
const authMiddleware  = require("../middleware/authMiddleware");
const Notification = require("../models/Notification");
const { sendNotification } = require("../utils/notification");

// Get all notifications for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("=== GET NOTIFICATIONS ===");
    console.log("req.user:", req.user);
    console.log("req.user.userId:", req.user.userId);
    
    const notifications = await Notification.find({ user: req.user.userId })
      .sort({ createdAt: -1 });
    
    res.json(notifications);
  } catch (err) {
    // console.error("Get notifications error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark a notification as read
router.put("/:id/read", authMiddleware, async (req, res) => {
  try {    
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      // console.log("Notification not found");
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.user.toString() !== req.user.userId.toString()) {
      // console.log("Not authorized");
      return res.status(403).json({ message: "Not authorized" });
    }

    notification.isRead = true;
    await notification.save();
    
    // console.log("Notification marked as read");

    res.json({ message: "Notification marked as read", notification });
  } catch (err) {
    // console.error("Mark as read error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark all notifications as read
router.put("/mark-all-read", authMiddleware, async (req, res) => {
  try {
    // console.log("=== MARK ALL AS READ ===");
    // console.log("User ID:", req.user.userId);
    
    const result = await Notification.updateMany(
      { user: req.user.userId, isRead: false },
      { isRead: true }
    );
    
    // console.log("Updated count:", result.modifiedCount);
    
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    // console.error("Mark all as read error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a notification
router.delete("/:id", authMiddleware, async (req, res) => {
  try { 
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      // console.log("Notification not found");
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.user.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await notification.deleteOne();
    res.json({ message: "Notification deleted" });
  } catch (err) {
    // console.error("Delete notification error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get unread notification count
router.get("/unread/count", authMiddleware, async (req, res) => {
  try {
    console.log("=== GET UNREAD COUNT ===");
    console.log("User ID:", req.user.userId);
    
    const count = await Notification.countDocuments({
      user: req.user.userId,
      isRead: false
    });
    
    // console.log("Unread count:", count);
    
    res.json({ count });
  } catch (err) {
    // console.error("Get unread count error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// TEST ENDPOINT - Create a test notification (for debugging)
router.post("/test", authMiddleware, async (req, res) => {
  try {    
    const notification = await sendNotification(req.user.userId, {
      type: "TEST_NOTIFICATION",
      message: "This is a test notification to verify the system works!",
    });
    res.json({ 
      message: "Test notification created successfully",
      notification: notification
    });
  } catch (err) {
    console.error("Test notification error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;