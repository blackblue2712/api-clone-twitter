const express = require("express");
const router = express.Router();
const {
    requestRelatedUserId,
    hasAuthorization,
    getUser,
    getUsers,
    updateUser,
    deleteUser,
    addFollowing,
    addFollower,
    unFollowing,
    unFollower
} = require("../controllers/user");
const { requireSignin } = require("../controllers/auth");

router.get("/users", getUsers);
router.get("/user/:userId", getUser);

// Toggle follow
router.put("/user/follow", requireSignin, addFollowing, addFollower);
router.put("/user/unfollow", requireSignin, unFollowing, unFollower);

router.put("/user/:userId", requireSignin, hasAuthorization, updateUser);
router.delete("/user/:userId", requireSignin, hasAuthorization, deleteUser);



// Any route contain userId, our app will first execute requestRelatedUserId()
router.param("userId", requestRelatedUserId);

module.exports = router;