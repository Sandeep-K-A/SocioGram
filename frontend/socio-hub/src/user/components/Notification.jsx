import { Modal, Box, Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import apiInstance from "../../utils/apiInstance";

const Notification = ({ isOpen, onClose }) => {
  const user = useSelector((state) => state.user);
  const user_id = user._id;
  const token = user.token;

  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const response = await apiInstance.get("/user-notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { success, notifications } = response.data;
      if (success) {
        setNotifications(notifications);
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);
  const handleClose = () => {
    onClose();
  };
  return (
    <div>
      <Modal
        className=""
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box
          sx={{ width: "25%", height: "100%" }}
          className="absolute top-1/2 right-1/2 transform -translate-x-1/3
           -translate-y-1/2 w-400 bg-slate-200 shadow-lg">
          <div className="text-2xl font-bold p-5">Notifications</div>
          <div className="flex flex-col overflow-y-auto max-h-[600px]">
            {notifications &&
              notifications.map((notification) => (
                <div
                  className="flex pl-5 pt-5 justify-between my-2"
                  key={notification._id}>
                  <div className="flex justify-center">
                    <Avatar
                      src={notification?.sender?.profilePic}
                      className=" mr-2 rounded-sm border-solid border-2 border-black border-opacity-20"
                      sx={{ width: 50, height: 50 }}
                    />
                    {notification?.type === "follow" ? (
                      <span className="text-black  pl-1 pt-2">
                        <span className="font-medium">
                          {notification?.sender?.userName}
                        </span>{" "}
                        started following you
                      </span>
                    ) : notification?.type === "comment" ? (
                      <span className="text-black  pl-1 pt-2">
                        <span className="font-medium">
                          {notification?.sender?.userName}
                        </span>{" "}
                        commented:{" "}
                        <span className="font-normal">
                          {notification?.contentComment}
                        </span>
                      </span>
                    ) : (
                      <span className="text-black  pl-1 pt-2">
                        <span className="font-medium">
                          {notification?.sender?.userName}
                        </span>{" "}
                        liked your post
                      </span>
                    )}
                  </div>
                  {notification?.type === "follow" ? (
                    <div className="bg-blue-400 w-16 h-8 mt-2 mx-2 rounded-md">
                      <span className="pl-2">follow</span>
                    </div>
                  ) : (
                    <div className=" w-10 h-10 mt-1 mx-2">
                      <img
                        className="w-full h-full object-cover"
                        src={notification?.content}
                      />
                    </div>
                  )}
                </div>
              ))}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Notification;
