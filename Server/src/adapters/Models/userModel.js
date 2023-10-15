import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({

    userId: {
        type: Number,
        unique: true
    },
    fullName: {
        type: String
    },
    userName: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    // phone: {
    //     type: String,

    // },
    password: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    },
    profilePic: {
        type: String,
        default: ''
    },
    profileName: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ""
    },
    googleId: {
        type: String,
        default: ""
    },
    followers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'users',
        default: []
    },
    following: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'users',
        default: []
    },
    verified: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })



const usersModel = mongoose.model('users', userSchema);

export default usersModel;