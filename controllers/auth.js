const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const {sendMail} = require("../helper/index");
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


module.exports.forgotPassword = (req, res) => {
    if(!req.body.email) return res.json( {error: "No email in request body"} );

    const email = req.body.email;
    // Find the user based on email
    User.findOne( {email}, (err, userForgot) => {
        if(err || !userForgot) return res.status(401).json( {error: "User with that email is not exist!"} );

        // Generate a token with that email and secret
        const token = jwt.sign(
            {_id: userForgot._id},
            process.env.JWT_SECRET
        );

        // Email data
        const emailData = {
            from: "nhuhao271219@gamil.com",
            to: email,
            subject: "Password Reset Instructions",
            text: `Please use the following link to reset your password: ${
                process.env.REACT_APP_API_URL
            }/reset-password/${token}`,
            html: `<p>Please use the following link to reset your password:</p> <p>${
                process.env.REACT_APP_API_URL
            }/reset-password/${token}</p>`
        }

        return userForgot.updateOne( {resetPasswordLink: token}, (err, result) => {
            if(err) return res.status(400).json( {error: err} );
            else {
                sendMail(emailData);
                return res.status(200).json( {message: `Email has been sent to ${email}. Please follow the instructions to reset your password.` } )
            }
        })

    })
}

module.exports.resetPassword = async (req, res) => {
    const resetPasswordLink = req.body.resetPasswordLink;
    const password = req.body.password;
    console.log(resetPasswordLink, password);
    await User.findOne( 
        {resetPasswordLink},
        (err, user) => {
            if(err || !user) return res.status(401).json( {error: "Invalid link!"} )
            else {
                user.password = password;
                user.resetPasswordLink = "";
                user.updated = Date.now();
                user.save( (err, result) => {
                    if(err) return res.status(401).json( {error: err} );
                    return res.status(400).json( {message: "Great! Your password updated. Now you can login with new password."} )
                })
            }
    })
}