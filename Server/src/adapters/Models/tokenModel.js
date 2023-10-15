import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true
    }
}, { timestamps: true, expires: 3600 })

const tokenModel = mongoose.model('tokens', tokenSchema)

export default tokenModel;