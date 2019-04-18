
module.exports.validateSignupUser = (req, res, next) => {
    req.check('username', 'User name is required').notEmpty();
    req.check('email', "Email is required").notEmpty();
    req.check('email')
       .matches(/.\@.+\..+/)
       .withMessage("Invalid email")
       .isLength({min: 4, max: 32})
       .withMessage("Email must contain between 4 to 32 characters");
    
    req.check("password", "Password is required").notEmpty();
    req.check("password")
       .matches(/\d/)
       .withMessage("Password must have a number")
       .isLength({min: 6})
       .withMessage("Password must contain at least 6 characters");

    // Check for error
    const errors = req.validationErrors();
    // If error show the first one as they happen
    if(errors) {
        const firstError = errors[0].msg;
        return res.status(400).json({
            error: firstError
        })
    }

    // Process to the next middleware
    next();
}