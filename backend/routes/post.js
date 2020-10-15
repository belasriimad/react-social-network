const express = require("express");
const { requireSignin } = require("../controllers/auth");
const {
  addPost,
  getAllPosts,
  userPosts,
  getPostById,
  isOwner,
  deletePost,
  likePost,
  unlikePost,
  deleteComment,
  addComment,
} = require("../controllers/post");
const { getUserById } = require("../controllers/user");

const router = express.Router();

router.get("/api/posts/:userId", requireSignin, getAllPosts);
router.get("/api/posts/by/:userId", requireSignin, userPosts);
router.delete("/api/post/:postId", requireSignin, isOwner, deletePost);
router.post("/api/post/create/:userId", requireSignin, addPost);
router.put("/api/post/like", requireSignin, likePost);
router.put("/api/post/unlike", requireSignin, unlikePost);
router.put("/api/post/comment", requireSignin, addComment);
router.put("/api/post/uncomment", requireSignin, deleteComment);

router.param("userId", getUserById);
router.param("postId", getPostById);

module.exports = router;
