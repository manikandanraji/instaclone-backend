const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  caption: {
    type: String,
    required: [true, "Please enter the caption"],
    trim: true,
  },
  tags: {
    type: [String],
  },
  files: {
    type: [String],
    validate: (v) => v === null || v.length > 0,
  },
  likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  likesCount: {
    type: Number,
    default: 0,
  },
  comments: [{ type: mongoose.Schema.ObjectId, ref: "Comment" }],
  commentsCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);
