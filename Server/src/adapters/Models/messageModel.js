import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({

    conversationId: {
        type: String
    },
    sender: {
        type: String
    },
    text: {
        type: String
    },
    seen: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const messageModel = mongoose.model('messages', messageSchema)

export default messageModel;