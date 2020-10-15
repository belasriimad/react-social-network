const Post = require("../models/post");

const getAllPosts = (req, res) => {
  let following = req.profile.following;
  following.push(req.profile._id);
  Post.find({ postedBy: { $in: req.profile.following } })
    .populate("comments", "text created")
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .sort("-createdAt")
    .exec((err, posts) => {
      if (err) res.json({ error: err });
      res.json(posts);
    });
};

const userPosts = (req, res) => {
  Post.find({ postedBy: req.profile._id })
    .populate("comments", "text created")
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .sort("-createdAt")
    .exec((err, posts) => {
      if (err) res.json({ error: err });
      res.json(posts);
    });
};

const getPostById = (req, res, next, id) => {
  Post.findById(id)
    .populate("comments", "text created")
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, post) => {
      if (err) res.json({ error: err });
      req.post = post;
      next();
    });
};

const isOwner = (req, res, next) => {
  let isMine = req.post && req.auth && req.post.postedBy._id == req.auth._id;
  if (!isMine) {
    return res.json({ error: "Non authorisé" });
  }
  next();
};

const addPost = (req, res) => {
  const { text } = req.body;
  let post = new Post({ text, postedBy: req.profile._id });
  post.save((err, data) => {
    if (err) res.json({ error: err });
    res.json(data);
  });
};

const deletePost = (req, res) => {
  let postToDelete = req.post;
  postToDelete.remove((err, deletedPost) => {
    if (err) res.json({ error: err });
    res.json(deletedPost);
  });
};

const likePost = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { likes: req.body.userId } },
    { new: true }
  ).exec((err, result) => {
    if (err) res.json({ error: err });
    res.json(result);
  });
};

const unlikePost = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { likes: req.body.userId } },
    { new: true }
  ).exec((err, result) => {
    if (err) res.json({ error: err });
    res.json(result);
  });
};

const addComment = (req, res) => {
  let comment = { text: req.body.text };
  comment.postedBy = req.body.userId;
  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { comments: comment } },
    { new: true }
  ).exec((err, result) => {
    if (err) res.json({ error: err });
    res.json(result);
  });
};

const deleteComment = (req, res) => {
  let comment = req.body.comment;
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: {
        comments: {
          _id: comment._id,
        },
      },
    },
    { new: true }
  ).exec((err, result) => {
    if (err) res.json({ error: err });
    res.json(result);
  });
};

module.exports = {
  getAllPosts,
  addPost,
  userPosts,
  getPostById,
  isOwner,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
};
