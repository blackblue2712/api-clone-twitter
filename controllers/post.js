const Post  = require("../models/post");
const User  = require("../models/user");
const _ = require("lodash");

module.exports.createPost = (req, res) => {
    // post = new Post(req.body);
}

module.exports.requestRelatedPostId = (req, res, next, id) => {
    Post.findById(id, (err, post) => {
        if(err || !post) return res.stauts(404).json( {error: "Can not get this post"} );
        req.post = post;
    });
    next();
}

module.exports.getPostByPostId = (req, res) => {
    return req.post;
}

module.exports.getPosts = async (req, res) => {
    await Post.find({})
    .populate("postedBy", "_id usrename photo")
    .exec((err, posts) => {
        if(err || posts) return res.stauts(400).json( {error: "Can not get posts, sommething went wrong"});
        res.status(200).json(posts);
    });
}

module.exports.getPostsByUserId = async (req, res) => {
    await Post.find({
        postedBy: req.userProfile._id
    }, (err, results) => {
        if(err) return req.status(404).josn( {error: "404 posts by this user not found"} );
        else return res.status(200).json(results);
    })
}