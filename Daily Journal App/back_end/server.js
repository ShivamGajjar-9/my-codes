require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("User", UserSchema);

// Journal Entry Schema
const EntrySchema = new mongoose.Schema({
  userId: String,
  title: String,
  content: String,
  mood: String,
  imageUrl: String,
  date: { type: Date, default: Date.now },
});

const Entry = mongoose.model("Entry", EntrySchema);

// Authentication Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).send("Access denied.");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send("Invalid token.");
  }
};

// Register User
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();
  res.json({ message: "User registered successfully!" });
});

// Login User
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Image Upload
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Create a Journal Entry
app.post("/entries", verifyToken, upload.single("image"), async (req, res) => {
  const { title, content, mood } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";
  const newEntry = new Entry({ userId: req.user.userId, title, content, mood, imageUrl });
  await newEntry.save();
  res.json({ message: "Entry added successfully!" });
});

// Get User's Journal Entries
app.get("/entries", verifyToken, async (req, res) => {
  const entries = await Entry.find({ userId: req.user.userId }).sort({ date: -1 });
  res.json(entries);
});

// Search Journal Entries
app.get("/search", verifyToken, async (req, res) => {
  const { query } = req.query;
  const entries = await Entry.find({
    userId: req.user.userId,
    $or: [
      { title: { $regex: query, $options: "i" } },
      { content: { $regex: query, $options: "i" } },
    ],
  });
  res.json(entries);
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

