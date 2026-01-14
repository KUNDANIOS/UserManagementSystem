const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Activity = require("../models/Activity");

// Stats per user
router.get("/stats", protect, async (req, res) => {
  const total = await Activity.countDocuments({ user: req.user._id });
  const completed = await Activity.countDocuments({
    user: req.user._id,
    done: true
  });

  res.json({
    totalActivities: total,
    activeTime: total + "h",
    completed,
    successRate: total === 0 ? "0%" : Math.round((completed / total) * 100) + "%"
  });
});

// Activity list per user
router.get("/activity", protect, async (req, res) => {
  const activities = await Activity.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(5);

  res.json(
    activities.map(a => ({
      id: a._id,
      title: a.title,
      desc: a.desc,
      time: a.createdAt.toLocaleString()
    }))
  );
});

// Create activity (for testing)
router.post("/add", protect, async (req, res) => {
  const { title, desc } = req.body;
  const activity = await Activity.create({
    user: req.user._id,
    title,
    desc
  });
  res.json(activity);
});

module.exports = router;
