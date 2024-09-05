import { Avatar, Modal, Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import EditProfileModal from "./EditProfileModal";
import { useSelector } from "react-redux";
import apiInstance from "../../utils/apiInstance";
import { useParams } from "react-router-dom";
import SinglePostModal from "./SinglePostModal";
import { FiHeart } from "react-icons/fi";
import { FaComment } from "react-icons/fa";
import { updateFollowing } from "../../utils/store/userSlice";
import { useDispatch } from "react-redux";
import ListsModal from "./ListsModal";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [open, setOpen] = useState(false);
  const [userProfileData, setUserProfileData] = useState({});
  const [profileFeaturesModal, setOpenProfileFeaturesModal] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [activeTabs, setActiveTabs] = useState("POSTS");
  const { userId } = useParams();
  const [singlePostModalOpen, setSinglePostModalOpen] = useState(false);
  const [postDetails, setPostDetails] = useState({});
  const [followingList, setFollowingList] = useState(false);
  const [userFollowing, setUserFollowing] = useState([]);
  const [userFollowers, setUserFollowers] = useState([]);
  const [followersList, setFollowersList] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSinglePostModalOpen = () => {
    setSinglePostModalOpen(true);
  };
  const hanldeSinglePostModalClose = () => {
    setSinglePostModalOpen(false);
  };
  const handleProfileFeatureModalOpen = () => {
    setOpenProfileFeaturesModal(true);
  };
  const handleProfileFeatureModalClose = () => {
    setOpenProfileFeaturesModal(false);
  };
  const handleTabChange = (tab) => {
    setActiveTabs(tab);
  };
  const handleMouseEnter = (post) => {
    console.log("mouseEnter");
    setPostDetails(post);
  };
  const handleFollowingListOpen = () => {
    setFollowingList(true);
  };
  const handleFollowingListClose = () => {
    setFollowingList(false);
  };
  const handleFollowersListOpen = () => {
    setFollowersList(true);
  };
  const handleFollowersListClose = () => {
    setFollowersList(false);
  };
  const updateLikes = (newLikes) => {
    // Update the likes state in the parent component
    console.log("triggered from singlePost Modal");
    setPostDetails((prevPostDetails) => ({
      ...prevPostDetails,
      likes: newLikes,
    }));
  };
  const user = useSelector((state) => state.user);
  const profileId = user.userId;
  const loggedUserId = user.id;
  const token = user.token;
  const fetchUserProfile = async () => {
    try {
      const response = await apiInstance.get(`profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { success, userDetails, userPosts } = response.data;
      if (success) {
        setUserProfileData(userDetails);
        setUserPosts(userPosts);
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };
  const handleFollow = async () => {
    try {
      const id = userProfileData._id;
      const response = await apiInstance.patch(
        `/user-follow-unfollow/${profileId}/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { success, followedUser, user } = response.data;
      if (success) {
        console.log(success, "*************");
        setUserProfileData((prevUserProfileData) => ({
          ...prevUserProfileData,
          followers: [...followedUser.followers],
        }));
        dispatch(updateFollowing({ user }));
      }
      handleProfileFeatureModalClose();
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };
  const fetchUserFollowing = async () => {
    try {
      const response = await apiInstance.get(`/user-following/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { success, following } = response.data;
      if (success) {
        setUserFollowing(following);
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };
  const fetchUserFollowers = async () => {
    try {
      const response = await apiInstance.get(`/user-followers/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { success, followers } = response.data;
      if (success) {
        setUserFollowers(followers);
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };
  const CreateNewConversation = async () => {
    const requestBody = {
      senderId: loggedUserId,
      recieverId: userProfileData?._id,
    };
    const response = await apiInstance.post(
      `/user-newconversation`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const { success, conversation } = response.data;
    if (success) {
      navigate(`/messenger?conversationId=${conversation._id}`);
    }
  };
  useEffect(() => {
    fetchUserProfile();
    fetchUserFollowing();
    fetchUserFollowers();
  }, [userId]);
  console.log(userId, "IIIIIIIIIIIIIiiii");
  return (
    <div className="mx-5 p-10 xl:mx-auto">
      <div className="grid grid-cols-4 gap-4">
        <div className="flex items-center justify-center">
          <Avatar
            src={userProfileData?.profilePic}
            className="!w-36 !h-36"
          />
        </div>
        <div className="col-span-2">
          <span className="text-gray-700 text-2xl mr-4">
            {userProfileData?.userName}
          </span>
          {profileId == userId ? (
            <div
              className="inline text-sm cursor-pointer font-semibold p-2 mr-4 border text-white bg-blue-500 rounded-full"
              onClick={handleOpen}>
              Edit Profile
            </div>
          ) : userProfileData?.followers?.includes(loggedUserId) ? (
            // <button
            //   className="text-sm text-white bg-red-600 font-medium px-3 py-1 rounded-lg"
            //   onClick={handleFollow}>
            //   unfollow
            // </button>
            <button
              className="bg-slate-400 text-white px-2 py-1 rounded-lg text-sm font-medium"
              onClick={handleProfileFeatureModalOpen}>
              following
            </button>
          ) : (
            <button
              className="text-sm text-white bg-blue-600 font-medium px-4 py-2 rounded-full"
              onClick={handleFollow}>
              follow
            </button>
          )}
          {profileId != userId ? (
            <button
              className="text-sm text-white bg-green-500 font-medium px-2 py-1 rounded-full ml-2"
              onClick={CreateNewConversation}>
              Message
            </button>
          ) : (
            ""
          )}
          <div className="flex mt-4">
            <div className="text-lg">
              <span className="font-bold pr-2">{userPosts?.length}</span>
              <span className="font-medium">posts</span>
            </div>
            <div
              className="ml-6 text-lg"
              onClick={handleFollowersListOpen}>
              <span className="font-bold pr-2">
                {userProfileData?.followers?.length}
              </span>
              <span className="font-medium">followers</span>
            </div>
            <div
              className="ml-6 text-lg"
              onClick={handleFollowingListOpen}>
              <span className="font-bold pr-2">
                {userProfileData?.following?.length}
              </span>
              <span className="font-medium">following</span>
            </div>
          </div>
          <div className="flex flex-col pt-2">
            <span className="font-bold text-lg">
              {userProfileData?.profileName}
            </span>
            <div className="w-96">
              <span>{userProfileData?.bio}</span>
            </div>
          </div>
        </div>
      </div>
      <hr className="border-gray-500 mt-8" />
      <div className="flex justify-center gap-10">
        <button
          className="border-gray-800 focus:border-t-2 py-4 text-sm font-semibold text-gray-400 focus:text-gray-600 "
          onClick={() => handleTabChange("POSTS")}>
          <FontAwesomeIcon
            className="pr-2"
            icon={faGripVertical}
            size="sm"
          />
          POSTS
        </button>
        {/* <button
          className="border-gray-800 focus:border-t-2 py-4 text-sm font-semibold text-gray-400 focus:text-gray-600 "
          onClick={() => handleTabChange("SAVED")}>
          <FontAwesomeIcon
            className="pr-2"
            icon={faBookmark}
            size="sm"
          />
          SAVED
        </button> */}
      </div>
      {activeTabs == "POSTS" && (
        <div className="grid grid-cols-3 gap-4">
          {userPosts?.map((post) => (
            <div
              className="h-64 overflow-hidden relative"
              key={post?.postId}
              onClick={() => {
                handleSinglePostModalOpen();
              }}
              onMouseEnter={() => {
                handleMouseEnter(post);
              }}>
              <div className="relative group cursor-pointer">
                <img
                  className="object-cover h-64 w-full"
                  src={post?.postImage}
                  alt=""
                />
                <div className="absolute top-0 opacity-0 group-hover:opacity-100 left-1 -translate-x-1 w-full h-full bg-black-rgba flex text-white justify-center items-center">
                  <div className="space-x-1 mr-5">
                    <FiHeart
                      className="w-6 h-6 inline"
                      style={{ fill: "white" }}
                    />
                    <span>{postDetails?.likes?.length}</span>
                  </div>
                  <div className="space-x-1">
                    <FaComment
                      className="h-6 w-6 inline"
                      style={{ transform: "scaleX(-1)", color: "white" }}
                    />
                    <span>{postDetails?.commentsCount}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* {activeTabs == "SAVED" && (
        <div className="grid grid-cols-3 gap-5">
          <div className="h-64 overflow-hidden">
            <img
              className="object-cover h-64 w-full"
              src=""
              alt=""
            />
          </div>
        </div>
      )} */}
      {open && (
        <EditProfileModal
          isOpen={open}
          onClose={handleClose}
        />
      )}
      {profileFeaturesModal && (
        <div>
          <Modal
            open={profileFeaturesModal}
            onClose={handleProfileFeatureModalClose}>
            <Box
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-400 bg-slate-950 shadow-lg rounded-2xl"
              sx={{ width: "25%", height: "30%" }}>
              <div className="flex flex-col justify-center items-center">
                <div className="flex flex-col items-center mt-8">
                  <Avatar
                    sx={{ width: 70, height: 70 }}
                    src={userProfileData?.profilePic}
                    className="mb-3"
                  />
                  <span className="text-lg font-semibold text-white">
                    {userProfileData?.userName}
                  </span>
                </div>
                <button
                  className="font-medium text-red-600 cursor-pointer mt-5"
                  onClick={handleFollow}>
                  unfollow
                </button>
              </div>
            </Box>
          </Modal>
        </div>
      )}
      {singlePostModalOpen && (
        <SinglePostModal
          isOpen={singlePostModalOpen}
          onClose={hanldeSinglePostModalClose}
          postId={postDetails?.postId}
          post_id={postDetails?._id}
          updateLikes={updateLikes}
        />
      )}
      {followingList && (
        <ListsModal
          listModalOpen={followingList}
          listModalClose={handleFollowingListClose}
          list={userFollowing}
          text={"Following"}
        />
      )}
      {followersList && (
        <ListsModal
          listModalOpen={followersList}
          listModalClose={handleFollowersListClose}
          list={userFollowers}
          text={"Followers"}
        />
      )}
    </div>
  );
}

export default Profile;
