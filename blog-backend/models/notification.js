const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: String, // receiver (blog author)
    required: true,
  },
  fromUserId: {
    type: String, // who liked
    required: true,
  },
  blogId: {
    type: Number,
    required: true,
  },
  type: {
    type: String, // like, comment
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
