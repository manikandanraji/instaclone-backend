const mongoose = require("mongoose");
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const asyncHandler = require("../middlewares/asyncHandler");

exports.getPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find();

  res.status(200).json({ success: true, data: posts });
});

exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate({
      path: "comments",
      select: "text",
      populate: {
        path: "user",
        select: "username avatar",
      },
    })
    .populate({
      path: "user",
      select: "username avatar",
    })
    .lean()
    .exec();

  if (!post) {
    return next({
      message: `No post found for id ${req.params.id}`,
      statusCode: 404,
    });
  }

  // is the post belongs to loggedin user?
  post.isMine = req.user.id === post.user._id.toString();

  // is the loggedin user liked the post??
  const likes = post.likes.map((like) => like.toString());
  post.isLiked = likes.includes(req.user.id);

  // is the loggedin user liked the post??
  const savedPosts = req.user.savedPosts.map((post) => post.toString());
  post.isSaved = savedPosts.includes(req.params.id);

  // is the comment on the post belongs to the logged in user?
  post.comments.forEach((comment) => {
    comment.isCommentMine = false;

    const userStr = comment.user._id.toString();
    if (userStr === req.user.id) {
      comment.isCommentMine = true;
    }
  });

  res.status(200).json({ success: true, data: post });
});

exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next({
      message: `No post found for id ${req.params.id}`,
      statusCode: 404,
    });
  }

  if (post.user.toString() !== req.user.id) {
    return next({
      message: "You are not authorized to delete this post",
      statusCode: 401,
    });
  }

  await User.findByIdAndUpdate(req.user.id, {
    $pull: { posts: req.params.id },
    $inc: { postCount: -1 },
  });

  await post.remove();

  res.status(200).json({ success: true, data: {} });
});

exports.addPost = asyncHandler(async (req, res, next) => {
  const { caption, files, tags } = req.body;
  const user = req.user.id;

  let post = await Post.create({ caption, files, tags, user });

  await User.findByIdAndUpdate(req.user.id, {
    $push: { posts: post._id },
    $inc: { postCount: 1 },
  });

  post = await post
    .populate({ path: "user", select: "avatar username fullname" })
    .execPopulate();

  res.status(200).json({ success: true, data: post });
});

exports.toggleLike = asyncHandler(async (req, res, next) => {
  // make sure that the post exists
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next({
      message: `No post found for id ${req.params.id}`,
      statusCode: 404,
    });
  }

  if (post.likes.includes(req.user.id)) {
    const index = post.likes.indexOf(req.user.id);
    post.likes.splice(index, 1);
    post.likesCount = post.likesCount - 1;
    await post.save();
  } else {
    post.likes.push(req.user.id);
    post.likesCount = post.likesCount + 1;
    await post.save();
  }

  res.status(200).json({ success: true, data: {} });
});

exports.addComment = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next({
      message: `No post found for id ${req.params.id}`,
      statusCode: 404,
    });
  }

  let comment = await Comment.create({
    user: req.user.id,
    post: req.params.id,
    text: req.body.text,
  });

  post.comments.push(comment._id);
  post.commentsCount = post.commentsCount + 1;
  await post.save();

  comment = await comment
    .populate({ path: "user", select: "avatar username fullname" })
    .execPopulate();

  res.status(200).json({ success: true, data: comment });
});

exports.deleteComment = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next({
      message: `No post found for id ${req.params.id}`,
      statusCode: 404,
    });
  }

  const comment = await Comment.findOne({
    _id: req.params.commentId,
    post: req.params.id,
  });

  if (!comment) {
    return next({
      message: `No comment found for id ${req.params.id}`,
      statusCode: 404,
    });
  }

  if (comment.user.toString() !== req.user.id) {
    return next({
      message: "You are not authorized to delete this comment",
      statusCode: 401,
    });
  }

  // remove the comment from the post
  const index = post.comments.indexOf(comment._id);
  post.comments.splice(index, 1);
  post.commentsCount = post.commentsCount - 1;
  await post.save();

  await comment.remove();

  res.status(200).json({ success: true, data: {} });
});

exports.searchPost = asyncHandler(async (req, res, next) => {
  if (!req.query.caption && !req.query.tag) {
    return next({
      message: "Please enter either caption or tag to search for",
      statusCode: 400,
    });
  }

  let posts = [];

  if (req.query.caption) {
    const regex = new RegExp(req.query.caption, "i");
    posts = await Post.find({ caption: regex });
  }

  if (req.query.tag) {
    posts = posts.concat([await Post.find({ tags: req.query.tag })]);
  }

  res.status(200).json({ success: true, data: posts });
});

exports.toggleSave = asyncHandler(async (req, res, next) => {
  // make sure that the post exists
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next({
      message: `No post found for id ${req.params.id}`,
      statusCode: 404,
    });
  }

  const { user } = req;

  if (user.savedPosts.includes(req.params.id)) {
    console.log("removing saved post");
    await User.findByIdAndUpdate(user.id, {
      $pull: { savedPosts: req.params.id },
    });
  } else {
    console.log("saving post");
    await User.findByIdAndUpdate(user.id, {
      $push: { savedPosts: req.params.id },
    });
  }

  res.status(200).json({ success: true, data: {} });
});
