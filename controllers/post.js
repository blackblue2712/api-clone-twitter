const Post  = require("../models/post");
const User  = require("../models/user");
const formidable = require("formidable");
const cloudinary = require('cloudinary');
const _ = require("lodash");
cloudinary.config({
    cloud_name: process.env.CLOUND_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,

})

module.exports.requestRelatedUserId = async (req, res, next, id) => {
    await User.findById(id)
    .select("_id username email photo followers following")
    .then(result => {
        // console.log(result)
        req.userProfile = result;
    })
    .catch( error => res.json( {error: "User not found"} ));
    next();
}

module.exports.requestRelatedPostId = (req, res, next, id) => {
    Post.findById(id, (err, post) => {
        if(err || !post) return res.status(404).json( {error: "Can not get this post"} );
        req.post = post;
        next();
    });
}

module.exports.isPoster = (req, res, next) => {
    let isPoster = req.post && req.payload && req.post.postedBy == req.payload._id;
    if(!isPoster) {
        return res.status(403).json( {error: '!isPoster. No authorized'} );
    }
    next();
}

module.exports.createPost = (req, res) => {
    let form = formidable.IncomingForm();
    form.keepExtensions = true;
	form.parse(req, (err, fields, files) => {
		if(err) {
			return res.status(400).json( {error: "Photo could not be uploaded file"} );
		}
		// save user
        let user = req.userProfile;
        let post = new Post(fields);
        post.postedBy = user._id;

		if(files.photo) {
    			cloudinary.v2.uploader.upload(files.photo.path, function(error, result) {
                post.photo = result.secure_url;
            }).then( () => {
                post.save( (err, result) => {
                    if(err) return res.status(400).json( {error: err} );
                    res.json(post);
                })
            })
        } else {
            post.save( (err, result) => {
                if(err) return res.status(400).json( {error: err} );
                res.json(post);
            })
        }
    });
}

module.exports.getPostByPostId = (req, res) => {
    res.json(req.post);
}

module.exports.getPosts = (req, res) => {
    Post.find({})
    .populate("postedBy", "_id usrename photo")
    .exec((err, posts) => {
        if(err || posts) return res.stauts(400).json( {error: "Can not get posts, sommething went wrong"});
        res.status(200).json(posts);
    });
}

module.exports.getPostByUser = (req, res) => {
    Post.find({
        postedBy: req.userProfile._id,
    }, null, {sort: {created: -1}}, (err, results) => {
        if(err) return req.status(404).json( {error: "404 posts by this user not found"} );
        else return res.status(200).json(results);
    })

}

module.exports.updatePost = (req, res) => {
    let form = formidable.IncomingForm();
    form.keepExtensions = true;
	form.parse(req, (err, fields, files) => {
		if(err) {
			return res.status(400).json( {error: "Photo could not be uploaded file"} );
		}
		// save user
        let post = req.post;
        post = _.extend(post, fields);
        post.updated = Date.now();

		if(files.photo) {
            if(post.photo) {
                const fileName = post.photo.split(".")[post.photo.split(".").length - 2];
                cloudinary.v2.uploader.destroy(fileName);
            }
            cloudinary.v2.uploader.upload(files.photo.path, function(error, result) {
            post.photo = result.secure_url;
            }).then( () => {
                post.save( (err, result) => {
                    if(err) return res.status(400).json( {error: err} );
                    res.json(post);
                })
            })
        } else {
            post.save( (err, result) => {
                if(err) return res.status(400).json( {error: err} );
                res.json(post);
            })
        }
    });
}

module.exports.deletePicPost = (req, res, next) => {
    let post = req.post;
    if(post.photo) {
        const fileName = post.photo.split(".")[user.photo.split(".").length - 2];
        cloudinary.v2.uploader.destroy(fileName, {}, () => {
            next();
        });
    }
    next();
}

module.exports.deletePost = (req, res) => {
    let post = req.post;
    if(post.photo) {
        const fileName = post.photo.split(".")[user.photo.split(".").length - 2];
        cloudinary.v2.uploader.destroy(fileName, () => {
            console.log("PICTURE DELETED...");
        })
        .then(() => {
            post.remove( (err, post) => {
                if(err) return res.status(403).json( {error: err} );
                res.json( {'message': 'Post deleted successfully'} );
            });        
        });
    }
    post.remove( (err, post) => {
        if(err) return res.status(403).json( {error: err} );
        res.json( {'message': 'Post deleted successfully'} );
    });
}
module.exports.like = (req, res) => {
    
}

module.exports.unlike = (req, res) => {

}