const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ObjectId } = mongoose.Schema;

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    about: {
      type: String,
      trim: true,
    },
    image: {
      data: Buffer,
      contentType: String,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    salt: String,
    hashed_password: {
      type: String,
      required: true,
    },
    following: [{ type: ObjectId, ref: "User" }],
    followers: [{ type: ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

UserSchema.virtual("password")
  .get(function () {
    return this._password;
  })
  .set(function (password) {
    this._password = password;
    let salt = (this.salt = bcrypt.genSaltSync(10));
    this.hashed_password = bcrypt.hashSync(password, salt);
  });

UserSchema.methods.comparePassword = function (passwordToCheck, cb) {
  bcrypt.compare(passwordToCheck, this.hashed_password, function (
    err,
    isMatch
  ) {
    if (err) cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);
