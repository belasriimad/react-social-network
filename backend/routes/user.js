const express = require("express");
const {
  createUser,
  getUserById,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserPhoto,
  addFollower,
  addFollowing,
  removeFollowing,
  removeFollower,
} = require("../controllers/user");
const {
  signin,
  requireSignin,
  hasAuthorization,
  signout,
} = require("../controllers/auth");

const router = express.Router();

router.post("/api/users/create", createUser);
router.get("/api/user/:userId", getUser);
router.post("/api/auth/signin", signin);
router.get("/api/auth/signout", signout);
router.get("/api/users", requireSignin, getAllUsers);
router.get("/api/user/photo/:userId", getUserPhoto);
router.put("/api/users/:userId", requireSignin, hasAuthorization, updateUser);
router.delete(
  "/api/users/:userId",
  requireSignin,
  hasAuthorization,
  deleteUser
);
router
  .route("/api/user/add/follow")
  .put(requireSignin, addFollowing, addFollower);
router
  .route("/api/user/remove/follow")
  .put(requireSignin, removeFollowing, removeFollower);

router.param("userId", getUserById);

module.exports = router;
