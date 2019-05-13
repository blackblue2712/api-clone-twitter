const express = require("express");
const router = express.Router();
const {
    isPoster,
    getPosts,
    getPostByPostId,
    getPostByUser,
    createPost,
    updatePost,
    deletePicPost,
    deletePost,
    requestRelatedPostId,
    requestRelatedUserId
} = require("../controllers/post");
const { requireSignin } = require("../controllers/auth");


router.get("/posts", getPosts);
router.post("/post/:userId", requireSignin, createPost);
router.get("/post/:userId", getPostByUser);
router.get("/post/edit/:postId", getPostByPostId);
router.put("/post/edit/:postId", requireSignin, isPoster, updatePost);
router.delete("/post/:postId", requireSignin, deletePicPost, deletePost);


// Any route contain postId, our app will first execute requestRelatedPostId()
router.param("postId", requestRelatedPostId);
router.param("userId", requestRelatedUserId);

module.exports = router;