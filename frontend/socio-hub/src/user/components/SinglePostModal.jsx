import { useState, useEffect, useRef } from "react";
import { Modal, Box } from "@mui/material";
import { Avatar } from "@mui/material";
import { MdMoreHoriz } from "react-icons/md";
import { FiHeart, FiSend } from "react-icons/fi";
import { FaCommentDots, FaRegBookmark } from "react-icons/fa";
import { useSelector } from "react-redux";
import apiInstance from "../../utils/apiInstance";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const SinglePostModal = ({ isOpen, onClose, postId, post_id, updateLikes }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [singlePostDetails, setSinglePostDetails] = useState({});
  const [postComment, setPostComment] = useState("");
  const [postComments, setPostComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [commentMenuOpen, setCommentMenuOpen] = useState(false);
  const [singlePostDescription, setSinglePostDescription] = useState("");
  const singlePostDescriptionRef = useRef(singlePostDescription);
  singlePostDescriptionRef.current = singlePostDescription;
  const [editPost, setEditPost] = useState(false);
  const [operationComment, setOperationComment] = useState({});
  const [reportModal, setReportModal] = useState(false);
  const [commentEdit, setCommentEdit] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const postCommentRef = useRef(postComment);
  postCommentRef.current = postComment;
  const pageSize = 10;
  const navigate = useNavigate();
  const handleClose = () => {
    onClose();
  };
  const handleUpdateLike = (newLikes) => {
    updateLikes(newLikes);
  };
  const handleMenuOpen = () => {
    setMenuOpen(true);
  };
  const handleMenuClose = () => {
    setMenuOpen(false);
  };
  const handleReportModalOpen = () => {
    handleMenuClose();
    setReportModal(true);
  };
  const handleReportModalClose = () => {
    setReportModal(false);
  };
  const handleOpenEdit = () => {
    handleMenuClose();
    setSinglePostDescription(singlePostDetails?.postDescription);
    setEditPost(true);
  };
  const handleCloseEdit = () => {
    setEditPost(false);
  };

  const handleCommentMenuOpen = (comment) => {
    setOperationComment(comment);
    setCommentMenuOpen(true);
  };
  const handleCommentMenuClose = () => {
    setCommentMenuOpen(close);
  };
  const handleCommentEditOpen = () => {
    setCommentEdit(true);
    handleCommentMenuClose();
  };
  const handleCommentEditClose = () => {
    setCommentEdit(false);
  };
  const user = useSelector((state) => state.user);
  const userId = user.userId;
  const id = user.id;
  const userName = user.userName;
  const token = user.token;
  const getSinglePost = async () => {
    try {
      const response = await apiInstance.get(`/user-post/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { success, post } = response.data;
      if (success) {
        setSinglePostDetails(post);
        let isUserLiked = post?.likes?.includes(userName);
        setIsLiked(isUserLiked);
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
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
        setIsLiked((prevIsLiked) => !prevIsLiked);
        setSinglePostDetails((prevSinglePostDetails) => ({
          ...prevSinglePostDetails,
          likes: likes,
        }));
        handleUpdateLike(likes);
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };
  const handleComment = async () => {
    try {
      let postId = singlePostDetails._id;
      if (postCommentRef.current == "") {
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
      const { success, newComment } = response.data;
      console.log(newComment, "OOOOOOO");
      if (success) {
        const updatedComments = [...postComments];
        updatedComments.push(newComment);
        setPostComments(updatedComments);
        setPostComment("");
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };
  const handleEditComment = async () => {
    try {
      if (operationComment.comment == "") {
        handleCommentEditClose();
        return;
      }
      const comment = encodeURIComponent(operationComment.comment);
      const requestBody = `comment=${comment}`;
      let response = await apiInstance.patch(
        `/user-edit-comment/${operationComment._id}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const { success, editedComment } = response.data;
      if (success) {
        const commentIndex = postComments.findIndex(
          (comment) => comment._id === editedComment._id
        );
        const updatedComments = [...postComments];
        updatedComments[commentIndex].comment = editedComment.comment;
        setPostComments(updatedComments);
        setOperationComment({});
      }
      handleCommentEditClose();
    } catch (error) {
      console.error(`API Error`);
    }
  };
  const handleEditPost = async () => {
    try {
      if (singlePostDescriptionRef.current == "") {
        handleCloseEdit();
        return;
      }
      const postDescription = encodeURIComponent(
        singlePostDescriptionRef.current
      );
      const requestBody = `postDescription=${postDescription}`;
      let response = await apiInstance.patch(
        `/user-edit-post/${postId}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const { success, editedPost } = response.data;
      if (success) {
        setSinglePostDetails((prevSinglePostDetails) => ({
          ...prevSinglePostDetails,
          postDescription: editedPost.postDescription,
        }));
        handleCloseEdit();
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };
  const handleDeletePost = async () => {
    try {
      const response = await apiInstance.patch(
        `user-delete-post/${postId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { success } = response.data;
      if (success) {
        navigate(`/profile/${userId}`);
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };
  const handleCommentLike_dislike = async (commentId) => {
    try {
      const response = await apiInstance.patch(
        `/user-post-comment-like/${commentId}/${userName}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { success, updatedComment } = response.data;
      if (success) {
        const commentIndex = postComments.findIndex(
          (comment) => comment._id === updatedComment.commentId
        );
        const updatedComments = [...postComments];
        updatedComments[commentIndex].likes = updatedComment.likes;
        setPostComments(updatedComments);
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };
  const handleDeleteComment = async () => {
    try {
      console.log(operationComment._id, "IIIIIIIIIIIIIII");
      const response = await apiInstance.patch(
        `user-delete-comment/${operationComment._id}/${post_id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { success, deletedComment } = response.data;
      console.log(deletedComment._id, "UUUUUUUUUUUU");
      if (success) {
        const deletedCommentIndex = postComments.findIndex(
          (comment) => comment._id === deletedComment._ic
        );
        const updatedComments = [...postComments];
        updatedComments.splice(deletedCommentIndex, 1);
        setPostComments(updatedComments);
      }
      handleCommentMenuClose();
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };
  const fetchPostComments = async (pageNumber) => {
    try {
      const response = await apiInstance.get(
        `/user-post-comments/${post_id}?page=${pageNumber}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { success, message, comments } = response.data;
      if (success) {
        setPostComments((prevPostComments) =>
          pageNumber === 1 ? comments : [...prevPostComments, ...comments]
        );
      } else {
        console.log(message);
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };
  const handleReport = async () => {
    try {
      if (reportReason == "") {
        return;
      }
      const requestBody = { reportReason };
      const response = await apiInstance.post(
        `/user-post-report/${id}/${singlePostDetails?._id}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const { success } = response.data;
      if (success) {
        handleClose();
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };
  const fetchData = async () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchPostComments(nextPage);
  };
  useEffect(() => {
    getSinglePost();
  }, [postId]);
  useEffect(() => {
    fetchPostComments(currentPage);
  }, []);

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box
          sx={{ width: "80%", height: "90%" }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-400 bg-slate-100 shadow-lg ">
          <div className="flex">
            <div className="w-3/5  h-627">
              <img
                className="object-cover w-full h-full"
                src={singlePostDetails?.postImage}
                alt=""
              />
            </div>
            <div className="w-2/5 flex flex-col">
              <div className="flex justify-between items-center m-3">
                <div className="flex items-center">
                  <Avatar
                    src={singlePostDetails?.userId?.profilePic}
                    className="mr-3">
                    R
                  </Avatar>
                  <span className="font-semibold mr-1">
                    {singlePostDetails?.userId?.userName}
                  </span>{" "}
                  •
                  {singlePostDetails?.userProfileId !== userId && (
                    <button className="text-blue-700 text-sm font-medium ml-2">
                      follow
                    </button>
                  )}
                </div>
                <MdMoreHoriz
                  onClick={handleMenuOpen}
                  className="cursor-pointer"
                />
              </div>
              <div className="border-b border-gray-400"></div>
              <div className=" overflow-y-auto max-h-[400px] flex flex-col">
                {/* <style>
                  {`
                     ::-webkit-scrollbar {width: 0.5em;}
                 `}
                </style> */}
                {/* {postComments?.map((singleComment) => (
                  <div
                    className="flex justify-between items-center m-3"
                    key={singleComment?._id}>
                    <div className="flex items-center">
                      <Avatar
                        src={singleComment?.userId?.profilePic}
                        className="mr-3">
                        R
                      </Avatar>
                      <span className="font-medium text-sm mr-1">
                        {singleComment?.userId?.userName}{" "}
                      </span>
                      <span className="text-sm">{singleComment?.comment}</span>
                    </div>
                    <div className="flex items-centet">
                      <FiHeart className="mr-2 cursor-pointer" />
                      <MdMoreHoriz className="cursor-pointer" />
                    </div>
                  </div>
                ))} */}
                <InfiniteScroll
                  dataLength={postComments.length} //This is important field to render the next data
                  next={fetchData}
                  hasMore={true}
                  scrollThreshold={200}>
                  {postComments?.map((singleComment) => (
                    <div
                      className="flex justify-between items-center m-3"
                      key={singleComment?._id}>
                      <div className="flex items-center">
                        <Avatar
                          src={singleComment?.userId?.profilePic}
                          className="mr-3">
                          R
                        </Avatar>
                        <span className="font-medium text-sm mr-1">
                          {singleComment?.userId?.userName}{" "}
                        </span>
                        {commentEdit &&
                        singleComment?._id == operationComment?._id ? (
                          <div className="flex justify-between">
                            <input
                              type="text"
                              value={operationComment?.comment}
                              onChange={(e) => {
                                setOperationComment((prevOperationComment) => ({
                                  ...prevOperationComment,
                                  comment: e.target.value,
                                }));
                              }}
                              className="w-full h-8 bg-slate-950 text-white pl-5 py-2 rounded-lg mr-2"
                            />
                            <div className="flex font-medium">
                              <button
                                className="mr-4 text-blue-600"
                                onClick={handleEditComment}>
                                edit
                              </button>
                              <button
                                className="text-red-600"
                                onClick={handleCommentEditClose}>
                                cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm">
                            {singleComment?.comment}
                          </span>
                        )}
                      </div>
                      {commentEdit &&
                      singleComment?._id == operationComment?._id ? (
                        ""
                      ) : (
                        <div className="flex items-centet">
                          <FiHeart
                            className="mr-2 cursor-pointer"
                            onClick={() =>
                              handleCommentLike_dislike(singleComment?._id)
                            }
                            style={{
                              fill: singleComment?.likes?.includes(userName)
                                ? "red"
                                : "none",
                            }}
                          />
                          {id == singlePostDetails?.userId?._id ||
                          id == singleComment?.userId?._id ? (
                            <MdMoreHoriz
                              className="cursor-pointer"
                              onClick={() =>
                                handleCommentMenuOpen(singleComment)
                              }
                            />
                          ) : (
                            ""
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </InfiniteScroll>
              </div>
              <div
                className="fixed bottom-0 w-2/5"
                id="LLLLLLLLLLLL">
                <div className="border-b border-gray-400 mb-2"></div>
                <div className="flex items-center justify-between">
                  <div className="flex ml-4">
                    <FiHeart
                      onClick={handleLike}
                      style={{ fill: isLiked ? "red" : "none" }}
                      className="w-6 h-6 m-1"
                    />
                    <FaCommentDots className="w-6 h-6 m-1" />
                    <FiSend className="w-6 h-6 m-1" />
                  </div>
                  <FaRegBookmark className="w-6 h-6 mr-4" />
                </div>
                <div className="flex flex-col ml-4">
                  <span className="font-semibold">
                    {singlePostDetails?.likes?.length} likes
                  </span>
                  <div className="flex">
                    <span className="font-semibold mr-1">
                      {singlePostDetails?.userId?.userName}
                    </span>
                    {editPost ? (
                      <div className="flex justify-between">
                        <input
                          type="text"
                          value={singlePostDescription}
                          onChange={(e) =>
                            setSinglePostDescription(e.target.value)
                          }
                          className="w-full h-8 bg-slate-950 text-white pl-5 py-2 rounded-lg mr-2"
                        />
                        <div className="flex font-medium">
                          <button
                            className="text-red-600 mr-4"
                            onClick={handleCloseEdit}>
                            cancel
                          </button>
                          <button
                            className="text-blue-600"
                            onClick={handleEditPost}>
                            edit
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span>{singlePostDetails?.postDescription}</span>
                    )}
                  </div>
                </div>
                <div className="border-b border-gray-400 mb-2 mt-2"></div>
                <div>
                  <div className="bg-transparent flex justify-between mt-2">
                    <input
                      className="bg-transparent outline-none w-96 ml-4"
                      type="text"
                      placeholder="Add a comment..."
                      value={postComment}
                      onChange={(e) => setPostComment(e.target.value)}
                    />
                    <button
                      className="text-blue-600 font-medium mr-2"
                      onClick={handleComment}>
                      post
                    </button>
                  </div>
                  <div className="border-b border-gray-400 mt-2"></div>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
      {menuOpen && (
        <div>
          <Modal
            open={menuOpen}
            onClose={handleMenuClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box
              sx={{ width: "20%", height: "auto" }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-400 bg-slate-950 shadow-xl rounded-2xl">
              <div className="flex flex-col font-semibold justify-between">
                {userId === singlePostDetails?.userProfileId ? (
                  <>
                    <div className="text-red-600  border-b border-slate-200 py-1 flex justify-center">
                      <span
                        className="cursor-pointer"
                        onClick={handleDeletePost}>
                        Delete
                      </span>
                    </div>
                    <div className="border-b border-slate-200  py-1 flex justify-center text-white">
                      <span
                        onClick={handleOpenEdit}
                        className="cursor-pointer">
                        Edit
                      </span>
                    </div>
                  </>
                ) : (
                  ""
                )}
                <div className=" border-slate-200  py-1 flex justify-center text-red-600">
                  <span
                    className="cursor-pointer"
                    onClick={handleReportModalOpen}>
                    Report
                  </span>
                </div>
              </div>
            </Box>
          </Modal>
        </div>
      )}
      {commentMenuOpen && (
        <div>
          <Modal
            open={commentMenuOpen}
            onClose={handleCommentMenuClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box
              sx={{ width: "20%", height: "auto" }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-400 bg-slate-950 shadow-xl rounded-2xl">
              <div className="flex flex-col font-semibold justify-between">
                <>
                  <div className="text-red-600  border-b border-slate-200 py-1 flex justify-center">
                    <span
                      className="cursor-pointer"
                      onClick={handleDeleteComment}>
                      Delete
                    </span>
                  </div>
                  {operationComment?.userId?._id == id && (
                    <div className="border-b border-slate-200  py-1 flex justify-center text-white">
                      <span
                        className="cursor-pointer"
                        onClick={handleCommentEditOpen}>
                        Edit
                      </span>
                    </div>
                  )}
                </>
                {/* <div className=" border-slate-200 border-b py-1 flex justify-center text-white">
                  <span className="cursor-pointer">Report</span>
                </div> */}
                <div className=" border-slate-200  py-1 flex justify-center text-white">
                  <span
                    className="cursor-pointer"
                    onClick={handleCommentMenuClose}>
                    Cancel
                  </span>
                </div>
              </div>
            </Box>
          </Modal>
        </div>
      )}
      {reportModal && (
        <div>
          <Modal
            open={reportModal}
            onClose={handleReportModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box
              sx={{ width: "30%", height: "auto" }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-400 bg-slate-950 shadow-xl rounded-2xl">
              <div className="flex justify-between">
                <div></div>
                <div className="text-white font-bold mt-2 mb-2 ml-12">
                  Report
                </div>
                <div>
                  <button
                    className="text-red-600 mt-3 font-bold text-xs mr-5"
                    onClick={handleReport}>
                    report
                  </button>
                </div>
              </div>
              <div className="border border-white"></div>
              {/* <div className="text-white font-semibold mt-2 ml-5">
                Why are you reporting this post ?
              </div> */}
              <div className="mt-2 ml-5 mb-5 text-white">
                <FormControl>
                  <FormLabel
                    id="demo-controlled-radio-buttons-group"
                    className="font-semibold"
                    sx={{ color: "white" }}>
                    why are you reporting this post ?
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    name="radio-buttons-group"
                    sx={{ color: "white" }}>
                    <FormControlLabel
                      className="text-white mb-2"
                      value="Its spam"
                      control={<Radio />}
                      label="It's spam"
                    />
                    <FormControlLabel
                      className="text-white mb-2"
                      value="Bullying or harassment"
                      control={<Radio />}
                      label="Bullying or harassment"
                    />
                    <FormControlLabel
                      className="text-white mb-2"
                      value="suicide or selfInjury"
                      control={<Radio />}
                      label="suicide or selfInjury"
                    />
                    <FormControlLabel
                      className="text-white mb-2"
                      value="Inappropriate Content"
                      control={<Radio />}
                      label="Inappropriate content"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </Box>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default SinglePostModal;
