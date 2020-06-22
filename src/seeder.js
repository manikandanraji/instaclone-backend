require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Comment = require("./models/Comment");
const Post = require("./models/Post");

mongoose.connect(process.env.MONGOURI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const deleteData = async () => {
  try {
    await User.deleteMany();
    await Comment.deleteMany();
    await Post.deleteMany();
    console.log("Deleted data...");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-d") {
  deleteData();
} else {
  console.log("not enough arguments");
  process.exit(1);
}
