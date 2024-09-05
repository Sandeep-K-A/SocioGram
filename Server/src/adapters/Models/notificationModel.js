import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    reciever: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    type: {
        type: String,
        enum: ['like', 'comment', 'follow'],
        required: true
    },
    content: {
        type: String,
    },
    contentComment: {
        type: String
    },
    isRead: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

const notificationModel = mongoose.model('notifications', notificationSchema)

export default notificationModel;