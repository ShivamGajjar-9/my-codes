const express = require("express");
const multer = require("multer");
const Entry = require("../models/Entry");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// Multer configuration for image upload
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage });

// Create a new journal entry
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { title, content, mood } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const newEntry = new Entry({
      userId: req.user.userId,
      title,
      content,
      mood,
      imageUrl,
    });

    await newEntry.save();
    res.json({ message: "Entry added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving entry." });
  }
});

// Get user journal entries
router.get("/", verifyToken, async (req, res) => {
  try {
    const entries = await Entry.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching entries." });
  }
});

// Search journal entries
router.get("/search", verifyToken, async (req, res) => {
  try {
    const { query } = req.query;
    const entries = await Entry.find({
      userId: req.user.userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: "Error searching entries." });
  }
});

module.exports = router;
