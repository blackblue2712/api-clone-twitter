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
    requestRelatedUserId,
    like,
    unlike,
    comment,
    uncomment
} = require("../controllers/post");
const { requireSignin } = require("../controllers/auth");


router.get("/posts", getPosts);

// Like and unlike
router.put("/post/like", requireSignin, like);
router.put("/post/unlike", requireSignin, unlike);

// Commnet and uncoment
router.put("/post/comment", requireSignin, comment);
router.put("/post/uncomment", requireSignin, uncomment);
router.get("/post/comment", (req, res) => {
    res.send("ALERT")    
});
// router.put("/post/uncomment", requireSignin, uncomment);

// CURD post 
router.post("/post/:userId", requireSignin, createPost);
router.get("/post/:userId", getPostByUser);
router.get("/post/edit/:postId", getPostByPostId);
router.put("/post/edit/:postId", requireSignin, isPoster, updatePost);
router.delete("/post/:postId", requireSignin, deletePost);


// Any route contain postId, our app will first execute requestRelatedPostId()
router.param("postId", requestRelatedPostId);
router.param("userId", requestRelatedUserId);

module.exports = router;

