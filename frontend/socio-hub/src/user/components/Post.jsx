import { Avatar } from "@mui/material";
import { MdMoreHoriz } from "react-icons/md";
import { FiSend, FiHeart } from "react-icons/fi";
import { FaRegBookmark, FaRegComment } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import apiInstance from "../../utils/apiInstance";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import SinglePostModal from "./SinglePostModal";
import { Box, Modal } from "@mui/material";

function Post({ postId }) {
  const [postDetails, setPostDetails] = useState({});
  const [isLiked, setIsLiked] = useState(false);
  const [commentClicked, setCommentClicked] = useState(false);
  const [postComment, setPostComment] = useState("");
  const [singlePostModalOpen, setSinglePostModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const postCommentRef = useRef(postComment);
  postCommentRef.current = postComment;

  // const prevPostLikesRef = useRef(postDetails.likes);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const userName = user.userName;
  // const userId = user.userId;
  const id = user.id;
  const token = user.token;
  const following = user.following;
  const handleCommentClick = () => {
    setCommentClicked(!commentClicked);
  };
  const handleSinglePostModalOpen = () => {
    setMenuOpen(false);
    setSinglePostModalOpen(true);
  };
  const hanldeSinglePostModalClose = () => {
    setSinglePostModalOpen(false);
  };
  const handleMenuOpen = () => {
    setMenuOpen(true);
  };
  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  // const handleCloseEdit = () => {
  //   setEditPost(false);
  // };
  const updateLikes = (newLikes) => {
    // Update the likes state in the parent component
    console.log("triggered from singlePost Modal");
    setIsLiked((prevIsLiked) => !prevIsLiked);
    setPostDetails((prevPostDetails) => ({
      ...prevPostDetails,
      likes: newLikes,
    }));
  };
  const handleLike = async () => {
    try {
      let response = await apiInstance.patch(
        `/user-post-like/${postId}/${userName}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { success, likes } = response.data;
      if (success) {
        // setIsLiked((prevIsLiked) => !prevIsLiked);
        updateLikes(likes);
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };
  const handleComment = async () => {
    try {
      let postId = postDetails._id;
      if (postCommentRef.current == "") {
        setCommentClicked(false);
        return;
      }
      let comment = encodeURIComponent(postCommentRef.current);
      const requestBody = `comment=${comment}`;

      let response = await apiInstance.post(
        `/user-post-comment/${postId}/${id}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded", // Set the content type to multipart/form-data
          },
        }
      );
      const { success } = response.data;
      setCommentClicked(false);
      console.log(success);
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };

  useEffect(() => {
    const getSinglePost = async () => {
      try {
        const response = await apiInstance.get(`/user-post/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { success, post } = response.data;
        if (success) {
          setPostDetails(post);
          let isUserLiked = post?.likes?.includes(userName);
          setIsLiked(isUserLiked);
        }
      } catch (error) {
        console.error(`API Error ${error}`);
      }
    };
    getSinglePost();
  }, [postId]);
  return (
    <div className="w-550 mt-6 mr-10 mb-12 ml-10">
      <div className="flex justify-between items-center mb-3">
        <div
          className="flex items-center font-semibold cursor-pointer"
          onClick={() => navigate(`/profile/${postDetails?.userProfileId}`)}>
          <Avatar
            src={postDetails?.userId?.profilePic}
            className="mr-3">
            R
          </Avatar>
          {postDetails?.userId?.userName} •{" "}
          <span className="text-gray-500 text-base pt-2px">12h</span>
        </div>
        <MdMoreHoriz
          className="cursor-pointer"
          onClick={handleMenuOpen}
        />
      </div>
      <div className="w-550 h-650px">
        <img
          src={postDetails?.postImage}
          alt=""
          className="w-full h-full object-cover rounded-sm border-solid border-2 border-black border-opacity-20"
        />
      </div>
      <div className="">
        <div className="flex justify-between items-center">
          <div className="flex">
            <FiHeart
              onClick={handleLike}
              style={{ fill: isLiked ? "red" : "none" }}
              className="w-5 h-5 m-2 hover:cursor-pointer"
            />
            <FaRegComment
              className="w-5 h-5 m-2 hover:cursor-pointer"
              onClick={handleCommentClick}
            />
            {/* <FiSend className="w-5 h-5 m-2 hover:cursor-pointer" /> */}
          </div>
          {/* <div className="">
            <FaRegBookmark className="w-5 h-5 hover:cursor-pointer" />
          </div> */}
        </div>
        <span className="font-semibold">
          {postDetails?.likes?.length} likes
        </span>{" "}
        <br />
        <span className="font-semibold mr-1">
          {postDetails?.userId?.userName}
        </span>
        <span>{postDetails?.postDescription}</span>
      </div>
      {/* <div className="border-1px border-black mt-10"></div> */}
      {commentClicked && (
        <>
          {" "}
          <div className="bg-transparent flex w-550 justify-between mt-2">
            <input
              className="bg-transparent outline-none w-96"
              type="text"
              placeholder="Add a comment..."
              onChange={(e) => setPostComment(e.target.value)}
            />
            <button
              className="text-blue-600 font-medium"
              onClick={handleComment}>
              post
            </button>
          </div>
          <div className="border-b border-gray-400 mt-2"></div>
        </>
      )}
      {singlePostModalOpen && (
        <SinglePostModal
          isOpen={singlePostModalOpen}
          onClose={hanldeSinglePostModalClose}
          postId={postId}
          post_id={postDetails?._id}
          updateLikes={updateLikes}
        />
      )}
      {menuOpen && (
        <div>
          <Modal
            open={menuOpen}
            onClose={handleMenuClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box
              sx={{ width: "20%", height: "auto" }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-400 bg-slate-950 shadow-lg rounded-2xl">
              <div className="flex flex-col font-semibold justify-between">
                {/* <div className="border-b border-slate-200  py-1 flex justify-center text-red-600">
                  <span className="cursor-pointer">Report</span>
                </div> */}
                {/* {following.includes(postDetails?.userId._id) ? (
                  <div className="border-b border-slate-200  py-1 flex justify-center text-white">
                    <span className="cursor-pointer">follow/unfollow</span>
                  </div>
                ) : (
                  ""
                )} */}
                <div className="border-b border-slate-200  py-1 flex justify-center text-white">
                  <span
                    className="cursor-pointer"
                    onClick={() =>
                      navigate(`/profile/${postDetails?.userProfileId}`)
                    }>
                    Visit Profile
                  </span>
                </div>
                <div className="py-1 flex justify-center border-b border-slate-200 text-white">
                  <span
                    onClick={handleSinglePostModalOpen}
                    className="cursor-pointer">
                    Go to Post
                  </span>
                </div>
                <div className="py-1 flex justify-center text-red-500">
                  <span
                    onClick={handleMenuClose}
                    className="cursor-pointer">
                    Cancel
                  </span>
                </div>
              </div>
            </Box>
          </Modal>
        </div>
      )}
    </div>
  );
}

export default Post;
