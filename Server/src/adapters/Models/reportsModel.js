import mongoose from "mongoose";

const reportsSchema = new mongoose.Schema({

    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    reportedPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts'
    },
    reason: {
        type: String,

    },
    isPending: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const reportsModel = mongoose.model('reports', reportsSchema)

export default reportsModel;