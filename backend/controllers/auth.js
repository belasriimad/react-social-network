const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
require("dotenv").config();

const signin = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err || !user) {
      return res.json({ error: "Aucune donnée trouvée" });
    }
    user.comparePassword(req.body.password, function (err, isMatch) {
      if (!isMatch) {
        return res.json({ error: "Email ou mot de passe est incorrect" });
      }
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      res.cookie("t", token, {
        expire: new Date() + 9999,
      });
      user.hashed_password = undefined;
      user.salt = undefined;
      return res.json({
        token,
        user,
      });
    });
  });
};

const signout = (req, res) => {
  res.clearCookie("t");
  res.json({ message: "Déconnecté" });
};

const requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
});

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!authorized) {
    return res.json({
      error: "Non authorisé",
    });
  }
  next();
};

module.exports = {
  signin,
  signout,
  hasAuthorization,
  requireSignin,
};
