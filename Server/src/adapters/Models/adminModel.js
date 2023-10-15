import mongoose from "mongoose";

const adminSchema = mongoose.Schema({

    adminId: {
        type: Number,
        unique: true
    },
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true })

const adminModel = mongoose.model('admins', adminSchema)

export default adminModel;