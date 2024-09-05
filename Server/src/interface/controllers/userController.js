import userRepository from "../../adapters/Repositories/userRepository";
import { jwtFunc } from "../../adapters/utils/jwt";
import { sendEmail } from "../../adapters/utils/sendEmail";
import { userSignupLogic } from "../../useCases/userUseCase/userSignup";
import { userGoogleSignupLogic } from "../../useCases/userUseCase/userGoogleSignup";
import { userGoogleSigninLogic } from "../../useCases/userUseCase/userGoogleSignin";
import { userForgotPasswordLogic } from "../../useCases/userUseCase/userForgotPasswordLogic";
import { userLoginLogic } from "../../useCases/userUseCase/userLogin";
import { userPasswordChangeLogic } from "../../useCases/userUseCase/userPasswordChangeLogic";
import { uploadProfilePic } from "../../useCases/userUseCase/userProfilePicUpload";
import { userCreatePost } from "../../useCases/userUseCase/userCreatePost";
import { streamUpload } from "../../adapters/utils/cloudinary";



export let userSignup = async (req, res) => {
    console.log('IOIOIOIOOOIOIO')
    const { fullName, userName, email, password } = req.body;
    try {
        let result = await userSignupLogic({ fullName, userName, email, password }, userRepository, jwtFunc, sendEmail)
        if (result.success) {
            // let token = result.token;
            // const maxAge = 7 * 24 * 60 * 60 * 1000
            // res.cookie('user', token, { maxAge: maxAge, httpOnly: true })
            res.send({
                success: true,
                message: result.message,
                user: result.user,
                // token
            })
        } else {
            res.send(result);
        }
    } catch (err) {
        console.log('error block')
        console.error(err)

    }
}

export let userEmailVerification = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const verifyToken = req.params.verifyToken;

        const result = await userRepository.verifyEmail(user_id, verifyToken)
        if (!result) {
            res.send({
                success: false,
                message: "Invalid link"
            })
        } else {
            res.send({
                success: true,
                message: "Email verified"
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}

export let userForgotPassVerification = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const verifyToken = req.params.verifyToken;

        const result = await userRepository.verifyForgotPassword(user_id, verifyToken)
        if (!result) {
            res.send({
                success: false,
                message: "Invalid link"
            })
        } else {
            res.send({
                success: true,
                message: "Make new Password for your account."
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}

export let userPasswordChange = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const { password } = req.body
        console.log(req.body)
        const result = await userPasswordChangeLogic(password, user_id, userRepository)
        if (result.success) {
            res.send({
                success: true,
                message: result.message
            })
        } else {
            res.send({
                success: false,
                message: result.message
            })
        }

    } catch (error) {
        throw new Error(error)
    }
}

export let userGoogleSignup = async (req, res) => {
    const userDataObj = JSON.parse(req.body.userData)
    const { fullName, firstName, lastName, email, profilePic, googleId } = userDataObj;
    console.log(req.body);
    try {
        let result = await userGoogleSignupLogic({ fullName, firstName, lastName, email, profilePic, googleId }, userRepository, jwtFunc)
        if (result.success) {
            let token = result.token;
            const maxAge = 7 * 24 * 60 * 60 * 1000
            res.cookie('user', token, { maxAge: maxAge, httpOnly: true })
            res.send({
                success: true,
                message: "new user added",
                user: result.user,
                token
            })
        } else {
            res.send(result);
        }
    } catch (error) {
        throw new Error(error)
    }
}

export let userGoogleSignin = async (req, res) => {
    try {
        const googleId = req.params.googleId;
        const result = await userGoogleSigninLogic(googleId, userRepository, jwtFunc)
        if (result.success) {
            let token = result.token;
            const maxAge = 7 * 24 * 60 * 60 * 1000
            res.cookie('user', token, { maxAge: maxAge, httpOnly: true })
            res.send({
                success: true,
                message: "user login successfull",
                user: result.user,
                token
            })
        } else {
            res.send(result)
        }
    } catch (error) {
        throw new Error(error)
    }
}

export let userlogin = async (req, res) => {
    const { email, password } = req.body
    try {
        let result = await userLoginLogic({ email, password }, userRepository, jwtFunc, sendEmail);

        if (result.success) {
            let token = result.token;
            const maxAge = 7 * 24 * 60 * 60 * 1000
            res.cookie('user', token, { maxAge: maxAge, httpOnly: true })
            res.send({
                success: true,
                message: "user login successfull",
                user: result.user,
                token
            })
        } else {
            res.send(result)
        }
    } catch (err) {
        throw new Error(err);
    }
}


export let userLogout = (req, res) => {
    try {

        res.clearCookie('user');
        res.send({
            success: true,
            message: "user successfully logged out"
        })
    } catch (err) {
        throw new Error(err)
    }
}

export let FetchUserDetailsById = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const result = await userRepository.findUserBy_id(user_id)
        if (!result) {
            res.send({
                success: false,
                message: "no user found."
            })
        } else {
            res.send({
                success: true,
                message: "user Details fetched successfully",
                userDetails: result
            })
        }
    } catch (error) {

    }
}

export let profileImageUpdate = async (req, res) => {
    try {
        console.log('req.file is ..', req.file)
        let image = req.file
        let userId = req.params.userId
        if (!image) {
            res.send({
                success: false,
                message: "no file uploaded"
            })
        }
        const result = await uploadProfilePic(image, userId, streamUpload, userRepository)
        if (result.success) {
            res.send(result)
        } else {
            res.send({
                success: false,
                message: "image upload failed"
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}

export let getUserDetails = async (req, res) => {
    try {
        let userId = req.params.userId;
        let result = await userRepository.getUserDetailsById(userId);
        if (!result) {
            res.send({
                success: false,
                message: "no user found in the directory"
            })
        }

        res.send({
            success: true,
            message: "user details successfully retrieved",
            user: result
        })
    } catch (error) {
        throw new Error(error)
    }
}

export let updateUserProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { userName, profileName, bio, gender } = req.body;
        let result = await userRepository.updateUserProfile(userId, userName, profileName, bio, gender)
        console.log(result)
        if (!result) {
            res.send({
                success: false,
                message: "user profile updation failed"
            })
        }
        res.send({
            success: true,
            user: result,
            message: "user profile successfully updated"
        })
    } catch (error) {
        throw new Error(error)
    }
}

export let createNewPost = async (req, res) => {
    try {
        const userProfileId = req.params.userId;
        const userId = req.params.id;
        let postImage = req.file
        const { postDescription } = req.body;
        const result = await userCreatePost(userId, userProfileId, postImage, postDescription, userRepository, streamUpload)
        if (!result) {
            res.send({
                success: false,
                message: "post creation failed",
            })
        }
        res.send({
            success: true,
            message: "post created successfully.",
            newPost: result
        })
    } catch (error) {
        // throw new Error(error)
        console.log(error)
    }
}
export let userFeedPosts = async (req, res) => {
    try {
        const userId = req.params.userId;
        const userProfileId = req.params.userProfileId;
        const page = req.query.page;
        const perPage = req.query.perPage;
        let result = await userRepository.getAllPosts(userProfileId, page, perPage);
        if (!result) {
            res.send({
                success: false,
                message: "failed to fetchuser posts"
            })
        }
        res.send({
            success: true,
            message: "user feed posts successfully retrieved.",
            userFeedPosts: result
        })
    } catch (error) {
        throw new Error(error)
    }
}

export let fetchUserProfile = async (req, res) => {
    try {
        const userId = req.params.userId
        let userDetails = await userRepository.getUserDetailsById(userId)
        let userPosts = await userRepository.getUserPosts(userId)
        if (!userDetails || !userPosts) {
            res.send({
                success: false,
                message: 'userProfile not found'
            })
        }
        res.send({
            success: true,
            message: "user Profile found successfully.",
            userDetails,
            userPosts
        })
    } catch (error) {
        throw new Error(error)
    }
}
export let userLikePost = async (req, res) => {
    try {
        let postId = req.params.postId;
        let userName = req.params.userName;
        let user_id = req.user_id;
        let result = await userRepository.likeUserPost(postId, userName, user_id)
        if (!result) {
            res.send({
                success: false,
                message: "user like and dislike operation failed"
            })
        }
        res.send({
            success: true,
            message: "user like and dislike operation successfull",
            likes: result
        })
    } catch (error) {
        throw new Error(error)
    }
}

export let
    userCommentPost = async (req, res) => {
        try {
            let postId = req.params.postId;
            let userId = req.params.userId;
            let comment = req.body.comment;
            let user_id = req.user_id;
            let result = await userRepository.postComment(postId, userId, comment, user_id);
            if (!result) {
                res.send({
                    success: false,
                    message: "adding a new comment to post failed"
                })
            } else {
                res.send({
                    success: true,
                    message: "adding a new comment to post successfull",
                    newComment: result
                })
            }

        } catch (error) {
            throw new Error(error)
        }
    }

export let userSinglePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const result = await userRepository.getSinglePost(postId);
        if (!result) {
            res.send({
                success: false,
                message: "failed to fetch the post details"
            })
        }
        res.send({
            success: true,
            message: "post details fetched successfully",
            post: result
        })
    } catch (error) {
        throw new Error(error)
    }
}

export let userPostComments = async (req, res) => {
    try {

        const postId = req.params.postId;
        console.log(postId)
        const page = req.query.page;
        const pageSize = req.query.pageSize;
        const result = await userRepository.getPostComments(postId, page, pageSize)
        if (!result) {
            res.send({
                success: false,
                message: "fetching comments of the post failed."
            })
        }
        res.send({
            success: true,
            message: "fetching comments of the post successfull",
            comments: result.postComments,
            commentsCount: result.CommentCount
        })
    } catch (error) {
        throw new Error(error)
    }
}
export let editUserPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const { postDescription } = req.body;
        const result = await userRepository.updateUserPost(postId, postDescription)
        if (!result) {
            res.send({
                success: false,
                message: "Edit post operation failed"
            })
        }
        res.send({
            success: true,
            message: "post successfully edited.",
            editedPost: result
        })
    } catch (error) {
        throw new Error(error)
    }
}
export let userSearch = async (req, res) => {
    try {
        let userName = req.query.userName;
        if (userName == "") {
            console.log('empty')
            return res.send({
                success: false,
                message: "no users found"
            })
        }
        const result = await userRepository.getUserSearch(userName)
        if (!result) {
            return res.send({
                success: false,
                message: "no users found"
            })
        }
        return res.send({
            success: true,
            message: "searched users found",
            users: result
        })
    } catch (error) {
        throw new Error(error)
    }
}
export let getUserFollowing = async (req, res) => {
    try {
        let userId = req.params.userProfileId
        let result = await userRepository.getUserFollowing(userId)
        console.log(result, '???????????')
        if (result) {
            res.send({
                success: true,
                message: "users following array fetched successfully",
                following: result
            })
        } else {
            res.send({
                success: false,
                message: "No users found"
            })
        }

    } catch (error) {
        throw new Error(error)
    }
}

export let user_Follow_or_unFollow = async (req, res) => {
    try {
        let userId = req.params.userId;
        let id = req.params.id;
        let user_id = req.user_id;
        console.log(userId, 'KKKKKKKK')
        console.log(id, '(((((((((((((((')
        let result = await userRepository.userfollowing(userId, id, user_id)
        console.log(result)
        if (!result) {
            res.send({
                success: false,
                message: "Invalid userId, user Not Found"
            })
        } else {
            res.send({
                success: true,
                message: "user follow and unfollow operaton successfull",
                followedUser: result.followedUser,
                user: result.user
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}

export let comment_like_dislike = async (req, res) => {
    try {
        let commentId = req.params.commentId;
        let userName = req.params.userName;
        const result = await userRepository.likeUserPostComment(commentId, userName)
        if (!result) {
            res.send({
                success: false,
                message: "userPost like or dislike comment operation failed"
            })
        } else {
            res.send({
                success: true,
                message: "userPost like or dislike operation successfull.",
                updatedComment: result
            })
        }
    } catch (error) {
        throw new Error(error)
    }

}
export let userEditPostComment = async (req, res) => {
    try {
        let commentId = req.params.commentId;
        let { comment } = req.body;
        const result = await userRepository.editUserPostComment(commentId, comment)
        if (!result) {
            res.send({
                success: false,
                message: "Editing of post comment unsuccessfull"
            })
        } else {
            res.send({
                success: true,
                message: "Post comment edited successfully",
                editedComment: result
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}
export let userDeletePostComment = async (req, res) => {
    try {
        let commentId = req.params.commentId;
        let postId = req.params.postId;
        let result = await userRepository.deleteUserPostComment(commentId, postId);
        if (!result) {
            res.send({
                success: false,
                message: "Deleting comment failed"
            })
        } else {
            res.send({
                success: true,
                message: "Comment Deleted Successfully",
                deletedComment: result
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}
export let userDeletePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const result = await userRepository.deleteUserPost(postId);
        if (!result) {
            res.send({
                success: false,
                message: "Deletion operation of the post failed."
            })
        } else {
            res.send({
                success: true,
                message: "Post Deleted Successfully.",
                deletedPost: result
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}
export let userPostReport = async (req, res) => {
    try {
        console.log(req.body)
        let userId = req.params.userId;
        let postId = req.params.postId;
        let reportReason = req.body.reportReason;
        let result = await userRepository.createNewPostReport(userId, postId, reportReason)
        if (result) {
            res.send({
                success: true,
                message: "Report submitted successfully"
            })
        } else {
            res.send({
                success: false,
                message: "Reporting the user Post failed"
            })
        }

    } catch (error) {
        throw new Error(error)
    }
}
export let getUserFollowers = async (req, res) => {
    try {
        let userId = req.params.userProfileId
        let result = await userRepository.getUserFollowers(userId)
        console.log(result, '???????????')
        if (result) {
            res.send({
                success: true,
                message: "users following array fetched successfully",
                followers: result
            })
        } else {
            res.send({
                success: false,
                message: "No users found"
            })
        }

    } catch (error) {
        throw new Error(error)
    }
}
export let forgotPassword = async (req, res) => {
    try {
        const email = req.body.forgotPassEmail;
        const result = await userForgotPasswordLogic(email, userRepository, sendEmail)
        if (!result) {
            res.send({
                success: false,
                message: "user for this email not exist"
            })
        } else {
            res.send({
                success: true,
                message: result.message
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}

export let getAllUserConversations = async (req, res) => {
    try {
        const userId = req.params.userId;
        const conversations = await userRepository.getUserConversations(userId)
        console.log(conversations, '{{{{{{')
        if (!conversations) {
            res.send({
                success: false,
                message: "No conversations for the user yet..."
            })
        } else {
            res.send({
                success: true,
                message: "Conversation of the user fetched successfully",
                conversations
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}

export let NewConversation = async (req, res) => {
    try {
        const { senderId, recieverId } = req.body;
        const result = await userRepository.createNewConversation(senderId, recieverId)
        res.send({
            success: true,
            message: "New conversation created",
            conversation: result
        })
    } catch (error) {
        throw new Error(error)
    }
}

export let FetchAllMessages = async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        const result = await userRepository.getAllMessages(conversationId)
        if (!result) {
            res.send({
                success: false,
                message: "No messages in the conversation yet."
            })
        } else {
            res.send({
                success: true,
                message: "Messages in the particular conversation fetched successfully",
                messages: result
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}
export let userNewMessage = async (req, res) => {
    console.log('***********88')
    try {
        const result = await userRepository.createNewMessage(req.body)
        if (!result) {
            res.send({
                success: false,
                message: "no idea"
            })
        } else {
            res.send({
                success: true,
                message: "new message successfully send",
                newMessage: result
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}
export let unSeenMessages = async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        const result = await userRepository.getMessagesCount(conversationId)
        console.log(result, conversationId, '&&&&&&&&&&&&&&&&&&&^^^^^^^^^^^^6')
        if (!result) {
            res.send({
                success: false,
                message: "Messages count unavailable"
            })
        } else {
            res.send({
                success: true,
                message: "Messages count fetched successfully",
                unSeenCount: result
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}
export let userNotifications = async (req, res) => {
    try {
        const user_id = req.user_id;
        console.log(user_id)
        const result = await userRepository.fetchUserNotifications(user_id)
        console.log(result)
        if (!result) {
            res.send({
                success: false,
                message: "No new Notifications"
            })
        } else {
            res.send({
                success: true,
                message: "Notifications successfully fetched.",
                notifications: result
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}