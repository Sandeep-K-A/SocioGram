import express from 'express';
const router = express.Router()
import {
    userSignup, userlogin, userLogout, profileImageUpdate, getUserDetails, updateUserProfile, createNewPost,
    userFeedPosts, fetchUserProfile, userLikePost, userCommentPost, userSinglePost, userPostComments, editUserPost,
    userSearch, userGoogleSignup, getUserFollowing, userGoogleSignin, user_Follow_or_unFollow, comment_like_dislike,
    userEditPostComment, userDeletePostComment, userDeletePost, userPostReport, getUserFollowers, userEmailVerification,
    forgotPassword, userForgotPassVerification, userPasswordChange, getAllUserConversations, FetchUserDetailsById,
    NewConversation, FetchAllMessages, userNewMessage, unSeenMessages, userNotifications
} from '../controllers/userController';

import upload from '../../adapters/middlewares/upload';
import { userAuth } from '../../adapters/utils/jwt';

router.post('/signup', userSignup)
router.get('/users/:user_id/verify/:verifyToken', userEmailVerification)
router.post('/signup-google', userGoogleSignup)
router.post('/signin', userlogin)
router.post('/signin-google/:googleId', userGoogleSignin)
router.post('/logout', userLogout)
router.post('/forgot-password', forgotPassword)
router.get('/users/:user_id/forgot-password/:verifyToken', userForgotPassVerification)
router.patch('/user/password-change/:user_id', userPasswordChange)

router.get('/user-userdetails/:user_id', userAuth, FetchUserDetailsById)

router.get('/profile/:userId', userAuth, fetchUserProfile)
router.get('/edit-profile/:userId', userAuth, getUserDetails)
router.patch('/edit-profile/:userId', userAuth, updateUserProfile)
router.post('/edit-profile-profilepic/:userId', userAuth, upload.single('image'), profileImageUpdate)

router.get('/user-search', userAuth, userSearch)

router.post('/user-new-post/:userId/:id', upload.single('postImage'), createNewPost)


router.get('/user-feed-posts/:userProfileId/:userId', userAuth, userFeedPosts)
router.get('/user-post/:postId', userAuth, userSinglePost)
router.patch('/user-post-like/:postId/:userName', userAuth, userLikePost)
router.post('/user-post-comment/:postId/:userId', userAuth, userCommentPost)
router.get('/user-post-comments/:postId', userAuth, userPostComments)
router.patch('/user-post-comment-like/:commentId/:userName', userAuth, comment_like_dislike)
router.patch('/user-edit-comment/:commentId', userAuth, userEditPostComment)
router.patch('/user-delete-comment/:commentId/:postId', userAuth, userDeletePostComment)
router.patch('/user-edit-post/:postId', userAuth, editUserPost)
router.patch('/user-delete-post/:postId', userAuth, userDeletePost)
router.post(`/user-post-report/:userId/:postId`, userAuth, userPostReport)

router.get('/user-following/:userProfileId', userAuth, getUserFollowing)
router.get('/user-followers/:userProfileId', userAuth, getUserFollowers)
router.patch('/user-follow-unfollow/:userId/:id', userAuth, user_Follow_or_unFollow)

router.post('/user-newconversation', NewConversation)
router.get('/user-conversations/:userId', userAuth, getAllUserConversations)
router.get('/user-messages/:conversationId', FetchAllMessages)
router.post('/user-new-message', userNewMessage)
router.get('/user-unseen-messages/:conversationId', unSeenMessages)

router.get('/user-notifications', userAuth, userNotifications)

module.exports = router