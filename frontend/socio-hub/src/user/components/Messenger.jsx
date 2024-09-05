import { Avatar } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Conversation from "./conversation";
import apiInstance from "../../utils/apiInstance";
import { useLocation } from "react-router-dom";
import Message from "./Message";
// import { io } from "socket.io-client";
import { useRef } from "react";
import { socket } from "../../utils/sockerServerConnection";

const Messenger = () => {
  const user = useSelector((state) => state.user);
  const profilePic = user.profilePic;
  const userName = user.userName;
  const userId = user.id;
  const token = user.token;
  const [conversations, setConversations] = useState(null);
  const [nullConversationmessage, SetNullConversationMessage] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const scrollRef = useRef();
  const newSocket = useRef(null);
  const [currentChatDetails, setCurrentChatDetails] = useState({});
  // newSocket.current = socket;

  useEffect(() => {
    // newSocket.current = io("http://localhost:3000");
    socket.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });

    // return () => {
    //   newSocket.current.disconnect();
    // };
  }, []);

  // useEffect(() => {
  //
  //   newSocket.current.on("getMessage", (data) => {
  //     setArrivalMessage({
  //       sender: data.senderId,
  //       text: data.text,
  //       createdAt: Date.now(),
  //     });
  //   });
  // }, []);

  useEffect(() => {
    socket.emit("addUser", userId);
    socket.on("getUsers", (user) => {
      console.log(user);
      setOnlineUsers(user);
    });
  }, [user]);

  const FetchUserConversations = async () => {
    try {
      const response = await apiInstance.get(`/user-conversations/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { success, message, conversations } = response.data;
      if (success) {
        setConversations(conversations);
      } else {
        SetNullConversationMessage(message);
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };

  const getMessages = async () => {
    try {
      const response = await apiInstance.get(
        `/user-messages/${currentChat?._id}`
      );
      const { success, messages } = response.data;
      if (success) {
        console.log(messages, "messages,,");
        setMessages(messages);
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    try {
      if (messageText == "") {
        return;
      }
      const requestBody = {
        conversationId: currentChat._id,
        sender: userId,
        text: messageText,
      };

      const recieverId = currentChat.members.find((member) => member != userId);

      socket.emit("sendMessage", {
        senderId: userId,
        recieverId,
        text: messageText,
      });
      const response = await apiInstance.post(`user-new-message`, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { success, newMessage } = response.data;
      if (success) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessageText("");
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };
  //Fetching Conversation
  useEffect(() => {
    FetchUserConversations();
  }, [userId]);
  //Fetching Messages of the conversation
  useEffect(() => {
    getMessages();
  }, [currentChat]);
  //Scroll change for new Message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);
  console.log(messages, "{{{{{{{{{{{[");

  return (
    <div className="flex">
      <div className="w-96 h-706 bg-gray-200 flex flex-col">
        <div className="flex ml-4 mb-4 pt-4 sticky top-0">
          <Avatar
            className="!w-16 !h-16"
            src={profilePic}
          />
          <span className="font-semibold text-xl text-black mt-4 ml-4">
            {userName}
          </span>
        </div>
        <div className="w-full border-b border-black"></div>
        <div className="flex flex-col overflow-y-auto">
          {conversations ? (
            conversations?.map((c) => (
              <div
                key={c?._id}
                onClick={() => {
                  setCurrentChat(c);
                }}>
                <Conversation
                  conversation={c}
                  currentUser={userId}
                  onlineUsers={onlineUsers}
                  updateDetails={setCurrentChatDetails}
                />
              </div>
            ))
          ) : (
            <p className="p-4 text-black">{nullConversationmessage}</p>
          )}
        </div>
      </div>
      <>
        {currentChat ? (
          <div className=" flex w-70 flex-col  border rounded-lg shadow-2xl">
            <div className="flex ml-4 my-2">
              <Avatar
                className="!w-12 !h-12"
                src={currentChatDetails?.profilePic}
              />
              <span className="text-black text-lg font-medium mt-2 ml-2">
                {currentChatDetails?.userName}
              </span>
            </div>
            <div className="border-b border-black"></div>
            <div className="flex flex-col overflow-y-auto max-h-[550px] ">
              {messages?.map((msg) => (
                <div
                  key={msg._id}
                  ref={scrollRef}>
                  {" "}
                  <Message msg={msg} />
                </div>
              ))}
            </div>
            <div className="fixed bottom-0 flex itsms-center justify-between h-14 rounded-full mb-5 ml-5">
              <input
                className="rounded-full w-550 bg-blue-100 outline-none pl-8 text-lg"
                type="text"
                placeholder="Write something...."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <button
                className="text-blue-500 font-bold text-lg ml-2"
                onClick={sendMessage}>
                send
              </button>
            </div>
          </div>
        ) : (
          <span className="text-6xl text-blue-200 text-center mt-72">
            Open a conversation to Start Chat.
          </span>
        )}
      </>
    </div>
  );
};

export default Messenger;
