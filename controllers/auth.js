const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
require("dotenv").config();

module.exports.signup = async (req, res) => {
    await User.findOne( {email: req.body.email}, function(err, obj) {
        if (obj) {
            return res.json({error: "Email is taken!"});
        } else {
            const user = new User(req.body);
            user.save( (error, result) => {
                if(error) return res.status(400).json( {error: error} );
                return res.status(200).json( {message: 'Signup successfully, please login'} );
            })
        }
    });
}

module.exports.signin = async (req, res) => {
    const { email, password } = req.body;

    // Find the user based on email
    User.findOne( {email: email}, (err, user) => {
        
        if(err || !user) return res.status(404).json( {error: 'User with that email is not exist, please signup'} );

        // If user found, make sure email and password match
        // Create authenticate method in user model and use here
        if(!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email or password do not match"
            });
        }
        
        // Generate token with  user id and secret
        const token = jwt.sign({'_id': user._id}, process.env.JWT_SECRET);
        // Persist the token as 't' in cookie with expiry date
        res.cookie('t', token, {'expire': new Date() + 3600});
        // Return response with user and token to frontend client
        const { _id, username, email } = user;
        return res.json( {token, user: {_id, username, email} } );
    });
}

module.exports.requireSignin = expressJwt({
    // if the token is valid, express jwt appends the verified users id
	// in an auth key to the request object
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
})

module.exports.signout = (req, res) => {
	res.clearCookie('t');
	return res.json({
		message: 'Singout success'
	});
}