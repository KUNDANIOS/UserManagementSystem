console.log("✅ user.routes.js loaded");
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../utils/upload");
// TEST ROUTE (no auth)
router.get("/test", (req, res) => {
  res.json({ ok: true });
});

// REAL ROUTE (with auth)
router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

router.put("/update", protect, async (req, res) => {
  const { name, email } = req.body;
  req.user.name = name;
  req.user.email = email;
  await req.user.save();
  res.json({ success: true, user: req.user });
});
router.put("/change-password", protect, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const isMatch = await req.user.matchPassword(oldPassword);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: "Old password incorrect" });
  }

  req.user.password = newPassword;
  await req.user.save();

  res.json({ success: true, message: "Password updated" });
});
router.post("/upload-avatar", protect, upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  req.user.avatar = `/uploads/${req.file.filename}`;   // use avatar
  await req.user.save();

  res.json({
    success: true,
    user: req.user  
  });
});


module.exports = router;
