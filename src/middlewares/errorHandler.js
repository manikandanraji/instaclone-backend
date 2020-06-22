const errorHandler = (err, req, res, next) => {
  console.log(err);

  let message = err.message || "Internal server error";
  let statusCode = err.statusCode || 500;

  if (err.code === 11000) {
    message = "Duplicate key";

    if (err.keyValue.email) {
      message = "The email is already taken";
    }

    if (err.keyValue.username) {
      message = "The username is already taken";
    }

    statusCode = 400;
  }

  if (err.name === "ValidationError") {
    const fields = Object.keys(err.errors);

    fields.map((field) => {
      if (err.errors[field].kind === "maxlength") {
        message = "Password should be maximum of 12 characters";
      } else {
        message = "Password should be minimum of 6 characters";
      }
    });

    statusCode = 400;
  }

  if (err.name === "CastError") {
    message = "The ObjectID is malformed";
    statusCode = 400;
  }

  res.status(statusCode).json({ success: false, message });
};

module.exports = errorHandler;
