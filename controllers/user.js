const User = require("../models/user");
const _ = require("lodash");

module.exports.hasAuthorization = (req, res, next) => {
    const authorized = req.payload && req.userProfile && req.userProfile._id == req.payload._id;
    if(!authorized) {
        return res.status(403).json( {error: "You don't authorized to perform this action!"} )
    }
    next();
}

module.exports.requestRelatedUserId = (req, res, next, id) => {
    User.findById(id)
    .select("_id username email photo followers following")
    .then(result => {
        console.log(result)
        req.userProfile = result;
    })
    .catch( error => res.json( {error: "User not found"} ));

    next();
}

module.exports.getUser = (req, res) => {
    return req.userProfile;
}

module.exports.getUsers = async (req, res) => {
    await User.find({})
    .select("_id username email photo followers following")
    .then(result => {
        return res.status(200).json( result );
    })
    .catch(error => {
        return res.status(400).json( {error: "Can not get all users, please try later"} );
    });
}

module.exports.updateUser = async (req, res) => {
    const userOld = req.userProfile;
    const userNew = _.extend(userOld, req.body);
    await User.findByIdAndUpdate(req.params.userId, userNew, (err, result) => {
        if(err) return res.status(400).json( {error: "Can not update user, please try again"} );
        else return res.status(200).json( result );
    });
}

module.exports.deleteUser = async (req, res) => {
    let user = req.userProfile;
    await user.remove( (err) => {
        if(err) return res.status(400).json( {error: "Can not delete your account"} );
        else return res.status(200).json("Your account is deleted successfully");
    });
}