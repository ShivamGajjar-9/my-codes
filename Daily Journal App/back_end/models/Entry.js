const mongoose = require("mongoose");

const EntrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    mood: { type: String, required: true },
    imageUrl: { type: String },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Indexes for better query performance
EntrySchema.index({ userId: 1 });
EntrySchema.index({ date: -1 });

module.exports = mongoose.model("Entry", EntrySchema);