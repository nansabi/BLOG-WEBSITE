const mongoose = require("mongoose");

// Schema => defines the structure of the blog documents
const blogschema = new mongoose.Schema({
  blogId: {
    type: Number,
    unique: true,
  },

  // 🔑 THIS IS THE MOST IMPORTANT FIELD (FOR DELETE / UPDATE)
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",        // refers to User model
    required: true,
  },

  likes: {
    type: [String], // userIds who liked
    default: [],
  },

  unlikes: {
    type: [String],
    default: [],
  },

  views: {
    type: Number,
    default: 0,
  },

  trendingScore: {
    type: Number,
    default: 0,
  },

  title: {
    type: String,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  // Display name (optional, for UI only)
  author: {
    type: String,
    required: true,
  },

  image: String,
  imagePublicId: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Model => allows interaction with the blogs collection
module.exports = mongoose.model("Blog", blogschema);
