import { Avatar } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { HiOutlineStatusOnline } from "react-icons/hi";
import apiInstance from "../../utils/apiInstance";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";

const Conversation = ({
  conversation,
  currentUser,
  onlineUsers,
  updateDetails,
}) => {
  const [isOnline, setIsOnline] = useState(false);
  const user = useSelector((state) => state.user);
  const token = user.token;

  const [userDetails, setUserDetails] = useState({});
  const [unSeen, setUnseen] = useState(null);
  const handleClick = () => {
    console.log("click event");
    updateDetails(userDetails);
  };

  const FetchUnSeenMessages = async () => {
    try {
      const response = await apiInstance.get(
        `/user-unseen-messages/${conversation?._id}`
      );
      const { success, unSeenCount } = response.data;
      if (success) {
        setUnseen(unSeenCount);
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };

  const FetchUserDetails = async () => {
    console.log("userDetails function invoked..");
    try {
      const friendId = conversation?.members?.find((m) => m !== currentUser);
      const response = await apiInstance.get(`/user-userdetails/${friendId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { success, userDetails } = response.data;
      if (success) {
        setUserDetails(userDetails);
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };

  useEffect(() => {
    FetchUserDetails();
  }, [currentUser, conversation]);

  useEffect(() => {
    const conversationUser = conversation?.members?.find(
      (member) => member != currentUser
    );
    console.log(typeof conversationUser);
    const onlineStatus = onlineUsers?.some(
      (user) => user.userId == conversationUser
    );
    setIsOnline(onlineStatus);
  }, [onlineUsers]);
  console.log(unSeen, "&&&&&&&&&&&&&&&&&");

  useEffect(() => {
    FetchUnSeenMessages();
  }, []);
  return (
    <div
      className="flex ml-4 my-2 cursor-pointer"
      onClick={handleClick}>
      <Avatar
        src={userDetails?.profilePic}
        className="!w-16 !h-16"
      />
      <div className="flex flex-col mt-1 ml-4">
        <span className="text-black font-medium">
          {userDetails?.profileName}
        </span>
        <span className="text-black font-normal">Hello my friend...</span>
      </div>
      <HiOutlineStatusOnline
        style={{ color: isOnline ? "green" : "" }}
        className="ml-20 mt-5"
      />
      <div className="ml-2 mt-3">
        <Badge
          badgeContent={unSeen}
          color="primary">
          <MailIcon color="action" />
        </Badge>
      </div>
    </div>
  );
};

export default Conversation;
