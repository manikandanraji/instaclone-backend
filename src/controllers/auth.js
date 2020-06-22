const User = require("../models/User");
const asyncHandler = require("../middlewares/asyncHandler");

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // make sure the email, pw is not empty
  if (!email || !password) {
    return next({
      message: "Please provide email and password",
      statusCode: 400,
    });
  }

  // check if the user exists
  const user = await User.findOne({ email });

  if (!user) {
    return next({
      message: "The email is not yet registered to an accout",
      statusCode: 400,
    });
  }

  // if exists, make sure the password matches
  const match = await user.checkPassword(password);

  if (!match) {
    return next({ message: "The password does not match", statusCode: 400 });
  }
  const token = user.getJwtToken();

  // then send json web token as response
  res.status(200).json({ success: true, token });
});

exports.signup = asyncHandler(async (req, res, next) => {
  const { fullname, username, email, password } = req.body;

  const user = await User.create({ fullname, username, email, password });

  const token = user.getJwtToken();

  res.status(200).json({ success: true, token });
});

exports.me = asyncHandler(async (req, res, next) => {
  const { avatar, username, fullname, email, _id, website, bio } = req.user;

  res
    .status(200)
    .json({
      success: true,
      data: { avatar, username, fullname, email, _id, website, bio },
    });
});
