import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts'
    },
    comment: {
        type: String
    },
    likes: [],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const commentsModel = mongoose.model('comments', commentSchema)

export default commentsModel; 
