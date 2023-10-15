import mongoose from "mongoose";


const postSchema = mongoose.Schema({
    postId: {
        type: Number
    },
    postImage: {
        type: String
    },
    postDescription: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    userProfileId: {
        type: Number
    },
    likes: [],
    commentsCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }


}, { timestamps: true })


const postsModel = mongoose.model('posts', postSchema)

export default postsModel
