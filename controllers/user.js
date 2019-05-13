const User = require("../models/user");
const _ = require("lodash");
const formidable = require("formidable");
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUND_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,

})
module.exports.hasAuthorization = (req, res, next) => {
    const authorized = req.payload && req.userProfile && req.userProfile._id == req.payload._id;
    if(!authorized) {
        return res.status(403).json( {error: "You don't authorized to perform this action!"} )
    }
    next();
}

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

module.exports.getUser = (req, res) => {
    res.json(req.userProfile);
}

module.exports.getUsers = (req, res) => {
    User.find({})
    .select("_id username email photo followers following")
    .then(result => {
        return res.status(200).json( result );
    })
    .catch(error => {
        return res.status(400).json( {error: "Can not get all users, please try later"} );
    });
}

module.exports.updateUser = (req, res) => {
    let form = formidable.IncomingForm();
	form.keepExtensions = true;
	form.parse(req, (err, fields, files) => {
		if(err) {
			return res.status(400).json( {error: "Photo could not be uploaded file"} );
		}
		// save user
		let user = req.userProfile;
		user = _.extend(user, fields);
		user.updated = Date.now();

		if(files.photo) {
            if(user.photo) {
                const fileName = user.photo.split(".")[user.photo.split(".").length - 2];
                cloudinary.v2.uploader.destroy(fileName);
            }
			cloudinary.v2.uploader.upload(files.photo.path, function(error, result) {
                console.log(result.secure_url)
                user.photo = result.secure_url;
            }).then(() => {
                user.save( (err, result) => {
                    if(err) return res.status(400).json( {error: err} );
        
                    user.hash_password = undefined;
                    user.salt = undefined;
                    res.json(user);
                })
            })
        } else {
            user.save( (err, result) => {
                if(err) return res.status(400).json( {error: err} );
    
                user.hash_password = undefined;
                user.salt = undefined;
                res.json(user);
            })
        }
        
		
    });
}

module.exports.deleteUser = (req, res) => {
    let user = req.userProfile;
    user.remove( (err) => {
        if(err) return res.status(400).json( {error: "Can not delete your account"} );
        else return res.status(200).json("Your account is deleted successfully");
    });
}