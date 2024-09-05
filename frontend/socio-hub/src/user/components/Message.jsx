import { Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import { format } from "timeago.js";

const Message = ({ msg }) => {
  const user = useSelector((state) => state.user);
  const userId = user.id;
  const messageClass = msg?.sender == userId ? "items-end" : "start";
  const messageTextClass =
    msg?.sender == userId ? "bg-gray-500" : "bg-blue-400";
  return (
    <div className={`mt-5 mb-2 flex flex-col ${messageClass}`}>
      <div className="flex ml-4 mr-4 items-center">
        <Avatar className="!w-9 !h-9" />
        <p
          className={`h-auto px-5 py-3 w-auto ${messageTextClass} text-white font-semibold rounded-full ml-2`}>
          {msg?.text}
        </p>
      </div>
      <div className="text-gray-400 text-sm mx-6">{format(msg?.createdAt)}</div>
    </div>
  );
};

export default Message;
