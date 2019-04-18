const mongoose = require("mongoose");
const uuidv1 = require('uuid/v1');
const crypto = require('crypto');
const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true
    },
    hashed_password: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    photo: String,
    salt: String,
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
    },
    followers: [{
        type: ObjectId,
        ref: "User",
    }],
    following: [{
        type: ObjectId,
        ref: "User",
    }],
    resetPasswordLink: {
        type: String,
        default: ""
    }
});

UserSchema.virtual('password')
    .set(function(password) {
        // Create temporary variable
        this._password = password;
        // Generate a timestamp
        this.salt = uuidv1();
        // Encrypt password
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function () {
        return this._password;
    })

UserSchema.methods = {
    authenticate: function(textPlain) {
        return this.encryptPassword(textPlain) === this.hashed_password;
    },

    encryptPassword: function(password) {
        try {
            return crypto.createHmac('sha256', this.salt)
                   .update(password)
                   .digest('hex');
        } catch(err) {
            return "error hashed password";
        }
    }
}

const User = mongoose.model("User", UserSchema);

module.exports = User;