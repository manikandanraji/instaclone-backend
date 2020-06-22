const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: "Post",
    required: true,
  },
  text: {
    type: String,
    required: [true, "Please enter the comment"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", CommentSchema);
