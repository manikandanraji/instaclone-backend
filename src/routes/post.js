const express = require("express");
const router = express.Router();
const {
  getPosts,
  getPost,
  addPost,
  deletePost,
  toggleLike,
  toggleSave,
  addComment,
  deleteComment,
  searchPost,
} = require("../controllers/post");
const { protect } = require("../middlewares/auth");

router.route("/").get(getPosts).post(protect, addPost);
router.route("/search").get(searchPost);
router.route("/:id").get(protect, getPost).delete(protect, deletePost);
router.route("/:id/togglelike").get(protect, toggleLike);
router.route("/:id/togglesave").get(protect, toggleSave);
router.route("/:id/comments").post(protect, addComment);
router.route("/:id/comments/:commentId").delete(protect, deleteComment);

module.exports = router;
