const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUser,
  follow,
  unfollow,
  feed,
  searchUser,
  editUser,
} = require("../controllers/user");
const { protect } = require("../middlewares/auth");

router.route("/").get(protect, getUsers);
router.route("/").put(protect, editUser);
router.route("/feed").get(protect, feed);
router.route("/search").get(searchUser);
router.route("/:username").get(protect, getUser);
router.route("/:id/follow").get(protect, follow);
router.route("/:id/unfollow").get(protect, unfollow);

module.exports = router;
