const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        maxLength: 150,
        minLength: 2
    },
    body: {
        type: String,
        require: "Body is required",
        maxLength: 1500,
        minLength: 4
    },
    photo: {
        type: String
    },
    postedBy: {
        type: ObjectId,
        ref: "User"
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    likes: [{
        type: ObjectId,
        ref: "User"
    }],
    comments: [{
        text: String,
        postedBy: {type: ObjectId, ref: "User"},
        created: {type: Date, default: Date.now}
    }]
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;

// default: "https://via.placeholder.com/300"