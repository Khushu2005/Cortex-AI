const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        firstname: {
            type: String,
            required: true,

        }, lastname: {
            type: String,
            required: true,

        }
    },

    password: {
        type: String,
    },
    resetPasswordOtp: { type: Number },
    resetPasswordExpires: { type: Date }
   
},

    { timestamps: true }
);

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;