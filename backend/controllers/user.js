const User = require("../models/user");
const _ = require("lodash");
const formidable = require("formidable");
const fs = require("fs");

const createUser = (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password });
  user.save((err, user) => {
    if (err) return res.json({ error: err });
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json(user);
  });
};

const getUserById = (req, res, next, id) => {
  User.findById(id)
    .populate("following", "_id name")
    .populate("followers", "_id name")
    .exec((err, user) => {
      if (err || !user) return res.json({ error: "Aucun profile trouvé" });
      req.profile = user;
      next();
    });
};

const getUser = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  res.json(req.profile);
};

const getAllUsers = (req, res) => {
  User.find((err, users) => {
    if (err || !users) return res.json({ error: err });
    res.json(users);
  }).select("name email about image createdAt");
};

const updateUser = (req, res) => {
  console.log(req.body);
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err)
      return res.json({ error: "Impossible d'ajouter le fichier séléctionné" });
    let user = req.profile;
    user = _.extend(user, fields);
    if (files.image) {
      user.image.data = fs.readFileSync(files.image.path);
      user.image.contentType = files.image.type;
    }
    user.save((err, result) => {
      if (err) return res.json({ error: err });
      result.hashed_password = undefined;
      result.salt = undefined;
      result.image = undefined;
      res.json(result);
    });
  });
};

const deleteUser = (req, res) => {
  let user = req.profile;
  user.remove((err, deletedUser) => {
    if (err) res.json({ error: err });
    res.json({ message: "Compte supprimé" });
  });
};

const getUserPhoto = (req, res) => {
  if (req.profile.image.data) {
    res.set("Content-Type", req.profile.image.contentType);
    return res.send(req.profile.image.data);
  } else {
    return res.sendFile(
      "c:/xampp/htdocs/react-social-network-channel/backend/images/user.png"
    );
  }
};

const addFollowing = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body.userId,
    { $push: { following: req.body.followId } },
    (err, result) => {
      if (err) return res.json({ error: err });
      next();
    }
  );
};

const addFollower = (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    { $push: { followers: req.body.userId } },
    { new: true }
  )
    .populate("following", "_id name ")
    .populate("followers", "_id name ")
    .exec((err, result) => {
      if (err) return res.json({ error: err });
      result.hashed_password = undefined;
      result.salt = undefined;
      result.image = undefined;
      res.json(result);
    });
};

const removeFollowing = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body.userId,
    { $pull: { following: req.body.followId } },
    (err, result) => {
      if (err) return res.json({ error: err });
      next();
    }
  );
};

const removeFollower = (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    { $pull: { followers: req.body.userId } },
    { new: true }
  )
    .populate("following", "_id name ")
    .populate("followers", "_id name ")
    .exec((err, result) => {
      if (err) return res.json({ error: err });
      result.hashed_password = undefined;
      result.salt = undefined;
      result.image = undefined;
      res.json(result);
    });
};

module.exports = {
  createUser,
  getUserById,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserPhoto,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
};
