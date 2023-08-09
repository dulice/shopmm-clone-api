const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: [true, "You can't leave this empty."],
    },
    email: {
        type: String,
        required: [true, "You can't leave this empty."],
        unique: [true, "Email already exists."],
        lowercase: true,
        validate: [isEmail, "Please enter a valid email."]
    },
    password: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
    },
    avatar: {
        type: String,
        default: "",
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    source: {
        type: String,
        default: "",
    }
},{ timestamps: true});

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

const User = mongoose.model("User", userSchema);
module.exports = User;