import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({

    members: {
        type: Array
    }

}, { timestamps: true })

const conversationModel = mongoose.model('conversations', conversationSchema)

export default conversationModel