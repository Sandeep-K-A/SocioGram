import adminModel from "../Models/adminModel";
import usersModel from "../Models/userModel";
import reportsModel from "../Models/reportsModel";
import postsModel from "../Models/userPosts";

const adminRepository = {

    findAdminByEmail: async (email) => {
        try {
            let admin = await adminModel.findOne({ email })
            if (admin) {
                return admin;
            } else {
                return null;
            }
        } catch (err) {
            throw new Error(err)
        }
    },
    createNewAdmin: async (adminId, userName, email, password) => {
        try {
            let admin = new adminModel({
                adminId,
                userName,
                email,
                password
            })

            let savedAdmin = await admin.save()
            return savedAdmin;
        } catch (error) {
            throw new Error(error)
        }
    },
    getAllUsers: async () => {
        try {
            let users = await usersModel.find()
            if (!users) {
                return null;
            }
            return users;
        } catch (error) {
            throw new Error(error)
        }
    },
    changeUserAccess: async (userId) => {
        try {
            const user = await usersModel.findOne({ userId })
            const newStatus = !user.status
            user.status = newStatus;
            await user.save()
            return {
                success: true,
                message: `user access changed successfully`
            }
        } catch (error) {
            throw new Error(error)
        }
    },
    deleteSingleUser: async (userId) => {
        try {
            let result = await usersModel.deleteOne({ userId })
            if (result.ok == 1) {
                return {
                    success: true,
                    message: "user Deleted"
                }
            } else {
                return {
                    success: false,
                    message: "user deletion failed"
                }
            }
        } catch (error) {
            throw new Error(error)
        }
    },
    findAdminById: async (adminId) => {
        try {
            let admin = await adminModel.findOne({ adminId })

            if (admin) {
                return admin;
            } else {
                return null;
            }
        } catch (err) {
            throw new Error(err)
        }
    },
    FetchAllReports: async () => {
        try {
            const Reports = await reportsModel.find({ isPending: false }).populate([
                { path: 'reportedBy', select: 'userName profilePic' },
                {
                    path: 'reportedPost', select: 'postId postImage postDescription likes commentsCount userId', populate: [
                        {
                            path: 'userId',
                            select: 'userName'
                        }
                    ]
                }

            ])
            if (!Reports) {
                return null;
            }
            return Reports
        } catch (error) {
            throw new Error(error)
        }
    },
    resolveReport: async (reportId, postId) => {
        try {
            const report = await reportsModel.findOne({ _id: reportId })
            const post = await postsModel.findOne({ _id: postId })
            if (!report || !post) {
                return null;
            }
            report.isPending = true;
            await report.save()
            post.isActive = false
            await post.save()
            return report;
        } catch (error) {
            throw new Error(error)
        }
    },
    deleteReport: async (reportId) => {
        try {
            const report = await reportsModel.findOne({ _id: reportId })
            if (!report) {
                return null;
            }
            report.isPending = true;
            await report.save()
            return report;
        } catch (error) {
            throw new Error(error)
        }
    },
    getUserCountMonth: async () => {
        try {
            const users = await usersModel.aggregate([
                {
                    $group: {
                        _id: { $month: '$createdAt' },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { '_id': 1 }
                }
            ]).exec()
            return users
        } catch (error) {
            throw new Error(error)
        }
    }
}

export default adminRepository;