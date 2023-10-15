import usersModel from "../Models/userModel";
import postsModel from "../Models/userPosts";
import commentsModel from "../Models/commentModel";
import reportsModel from "../Models/reportsModel";
import tokenModel from "../Models/tokenModel";

const userRepository = {

    findUserByEmail: async (email) => {
        try {
            let user = await usersModel.findOne({ email: email })
            if (user) {
                return user;
            } else {
                return null;
            }
        } catch (err) {
            throw new Error(err);
        }
    },
    findUserById: async (userId) => {
        try {
            let user = await usersModel.findOne({ userId })
            if (!user) {
                return null;
            }
            return user;
        } catch (error) {
            throw new Error(error)
        }
    },
    verifyEmail: async (user_id, token) => {
        try {
            const user = await usersModel.findOne({ _id: user_id })
            const verifyToken = await tokenModel.findOne({ userId: user_id, token: token })
            if (!user || !verifyToken) {
                return null;
            }
            user.verified = true;
            await user.save()
            await verifyToken.deleteOne()
            return true
        } catch (error) {
            throw new Error(error)
        }
    },
    verifyForgotPassword: async (user_id, token) => {
        try {
            const user = await usersModel.findOne({ _id: user_id })
            const verifyToken = await tokenModel.findOne({ userId: user_id, token: token })
            if (!user || !verifyToken) {
                return null;
            }
            await verifyToken.deleteOne()
            return true;
        } catch (error) {
            throw new Error(error)
        }
    },
    updatePassword: async (user_id, newPassword) => {
        try {
            const user = await usersModel.findOne({ _id: user_id })
            if (!user) {
                return null;
            }
            user.password = newPassword;
            await user.save()
            return true;
        } catch (error) {
            throw new Error(error)
        }
    },
    createNewUser: async (userId, fullName, userName, email, password) => {
        try {
            let newUser = new usersModel({
                userId,
                fullName,
                userName,
                email,
                password
            })

            let savedUser = await newUser.save();
            return savedUser;
        } catch (err) {
            throw new Error(err)
        }
    },
    createToken: async (userId, token) => {
        try {
            const tokenExist = await tokenModel.findOne({ userId })

            if (tokenExist) {
                tokenExist.token = token;
                await tokenExist.save()
                return tokenExist
            } else {
                const userToken = new tokenModel({
                    userId,
                    token
                })
                await userToken.save()
                return userToken;
            }

        } catch (error) {
            throw new Error(error)
        }
    },
    createNewUserByGoogleId: async (userId, googleId, fullName, userName, email, profilePic) => {
        try {
            let newUser = new usersModel({
                userId,
                googleId,
                fullName,
                userName,
                email,
                profilePic
            })
            let savedUser = await newUser.save()
            return savedUser
        } catch (error) {
            throw new Error(error)
        }
    },

    findUnBlockedUserByGoogleId: async (googleId) => {
        try {
            let user = await usersModel.findOne({ googleId: googleId, status: true })
            if (!user) {
                return null;
            }
            return user;
        } catch (error) {
            throw new Error(error)
        }
    },

    findUnBlockedUserByEmail: async (email) => {
        try {
            let user = await usersModel.findOne({ email: email, status: true })
            if (user) {
                return user
            } else {
                return null;
            }
        } catch (err) {
            throw new Error(err);
        }
    },
    updateProfilePic: async (userId, imageUrl) => {
        try {
            const result = await usersModel.updateOne({ userId: userId }, { $set: { profilePic: imageUrl } })
            if (result.acknowledged) {
                return true
            }
        } catch (error) {
            throw new Error(error)
        }
    },
    getUserDetailsById: async (userId) => {
        try {
            const user = await usersModel.findOne({ userId: userId })
            if (!user) {
                return null;
            }
            return user;
        } catch (error) {
            throw new Error(error)
        }
    },
    updateUserProfile: async (userId, userName, profileName, bio, gender) => {
        try {
            let user = await usersModel.findOne({ userId: userId })
            if (!user) {
                return false
            }
            user.userName = userName;
            user.profileName = profileName;
            user.bio = bio;
            user.gender = gender;
            await user.save()

            return user;

        } catch (error) {
            throw new Error(error)
        }
    },
    userNewPost: async (userId, userProfileId, postId, postImage, postDescription) => {
        console.log(userId, '...........')
        console.log(userProfileId, '>>>>>>>>>>>>>>')
        try {
            const newUserPost = new postsModel({
                postId,
                postImage,
                postDescription,
                userId,
                userProfileId,
                likes: []
            })
            await newUserPost.save()
            return newUserPost

        } catch (error) {
            console.log(error)

            throw new Error(error)
        }
    },
    getAllPosts: async (userProfileId, page, perPage) => {
        try {
            const user = await usersModel.findOne({ userId: userProfileId })
            if (!user) {
                return null;
            }
            const skip = (page - 1) * perPage;
            const limit = Number(perPage)
            const posts = await postsModel.aggregate([
                {
                    $match: {
                        $and: [
                            {
                                $or: [
                                    { userId: user._id },
                                    { userId: { $in: user.followers } }
                                ]
                            },
                            { isActive: true }
                        ]
                    }
                },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                { $unwind: '$user' }
            ])
            console.log(posts, 'all posts............')
            if (!posts) {
                return null;
            }
            return posts
        } catch (error) {
            throw new Error(error)
        }
    },
    getUserPosts: async (userProfileId) => {
        try {
            let userPosts = await postsModel.find({ userProfileId: userProfileId, isActive: true })
            if (!userPosts) {
                return null;
            }
            return userPosts
        } catch (error) {
            throw new Error(error)
        }
    },
    likeUserPost: async (postId, userName) => {
        try {
            let post = await postsModel.findOne({ postId })
            if (!post) {
                return null;
            }
            if (post.likes.includes(userName)) {
                let index = post.likes.indexOf(userName)
                post.likes.splice(index, 1)
                await post.save()
            } else {
                post.likes.push(userName)
                await post.save()
            }
            return post.likes;
        } catch (error) {
            throw new Error(error)
        }
    },
    postComment: async (postId, userId, comment) => {
        try {
            let newComment = await new commentsModel({
                userId,
                postId,
                comment
            }).save()
            let fetchNewComment = await commentsModel.findOne({ _id: newComment._id, isActive: true }).populate([
                { path: 'userId', select: '_id userName profilePic' }
            ])
            let count = await commentsModel.countDocuments({ postId: postId, isActive: true })
            let post = await postsModel.findOne({ _id: postId })
            post.commentsCount = count;
            post.save()
            return fetchNewComment;
        } catch (error) {
            throw new Error(error)
        }
    },
    getSinglePost: async (postId) => {
        try {
            const post = await postsModel.findOne({ postId }).populate({
                path: 'userId',
                select: '_id fullName userName profilePic'
            })
            if (!post) {
                return null;
            }
            return post;
        } catch (error) {
            throw new Error(error)
        }
    },
    getPostComments: async (postId, page, pageSize) => {
        try {
            const skip = (page - 1) * pageSize;
            console.log(skip, 'Skip')
            const postComments = await commentsModel.find({ postId: postId, isActive: true }).populate([
                { path: 'userId', select: '_id userName profilePic' }
            ]).skip(skip).limit(pageSize)
            if (!postComments) {
                return null;
            }
            const CommentCount = await commentsModel.countDocuments({ postId: postId, isActive: true })
            console.log(postComments)
            return { postComments, CommentCount }
        } catch (error) {
            throw new Error(error)
        }
    },
    updateUserPost: async (postId, postDescription) => {
        try {
            const post = await postsModel.findOne({ postId })
            if (!post) {
                return null;
            }
            post.postDescription = postDescription;
            await post.save()
            return post;
        } catch (error) {
            throw new Error(error)
        }
    },
    getUserSearch: async (userName) => {
        try {
            const users = await usersModel.find({ userName: { $regex: userName, $options: 'i' } })
            if (!users) {
                return null;
            }
            return users;
        } catch (error) {
            throw new Error(error)
        }
    },
    getUserFollowing: async (userId) => {
        try {
            const user = await usersModel.findOne({ userId }).populate({
                path: 'following',
                select: 'userName userId profilePic profileName'
            })
            console.log(user, '{{{{{{{{}}{}}}{')
            if (!user) {
                return null;
            }
            return user.following;
        } catch (error) {
            throw new Error(error)
        }
    },
    userfollowing: async (userId, id) => {
        try {
            const user = await usersModel.findOne({ userId })
            const followedUser = await usersModel.findById(id)
            if (!user) {
                return null;
            }
            if (user.following.includes(id)) {
                let index = user.following.indexOf(id);
                user.following.splice(index, 1)
                await user.save()
                let followerIndex = followedUser.followers.indexOf(user._id)
                followedUser.followers.splice(followerIndex, 1)
                await followedUser.save()
                return { followedUser, user };
            } else {
                user.following.push(id);
                await user.save()
                followedUser.followers.push(user._id)
                await followedUser.save()
                return { followedUser, user };
            }
        } catch (error) {
            throw new Error(error)
        }
    },
    likeUserPostComment: async (commentId, userName) => {
        try {
            const comment = await commentsModel.findOne({ _id: commentId })
            console.log(comment)
            if (!comment) {
                return null;
            }
            if (comment.likes.includes(userName)) {
                let index = comment.likes.indexOf(userName)
                comment.likes.splice(index, 1);
                await comment.save()
            } else {
                comment.likes.push(userName)
                await comment.save()
            }
            return {
                commentId: comment._id,
                likes: [...comment.likes]
            }
        } catch (error) {
            throw new Error(error)
        }
    },
    editUserPostComment: async (commentId, comment) => {
        try {
            let editedComment = await commentsModel.findOne({ _id: commentId })
            if (!editedComment) {
                return null;
            }
            console.log(editedComment)
            editedComment.comment = comment;
            await editedComment.save()
            return editedComment;
        } catch (error) {
            throw new Error(error)
        }
    },
    deleteUserPostComment: async (commentId, postId) => {
        try {
            let deletedComment = await commentsModel.findOne({ _id: commentId })
            if (!deletedComment) {
                return null;
            }
            deletedComment.isActive = false;
            await deletedComment.save()
            let count = await commentsModel.countDocuments({ postId: postId, isActive: true })
            let post = await postsModel.findOne({ _id: postId })
            post.commentsCount = count;
            post.save()
            return deletedComment;
        } catch (error) {
            throw new Error(error)
        }
    },
    deleteUserPost: async (postId) => {
        try {
            let post = await postsModel.findOne({ postId })
            if (!post) {
                return null;
            }
            post.isActive = false;
            await post.save()
            return post;
        } catch (error) {
            throw new Error(error)
        }
    },
    createNewPostReport: async (userId, postId, reportReason) => {
        try {
            let report = new reportsModel({
                reportedBy: userId,
                reportedPost: postId,
                reason: reportReason
            })
            await report.save()
            return true
        } catch (error) {
            throw new Error(error)
        }
    },
    getUserFollowers: async (userId) => {
        try {
            const user = await usersModel.findOne({ userId }).populate({
                path: 'followers',
                select: 'userName userId profilePic profileName'
            })
            console.log(user, '{{{{{{{{}}{}}}{')
            if (!user) {
                return null;
            }
            return user.followers;
        } catch (error) {
            throw new Error(error)
        }
    }

}

export default userRepository