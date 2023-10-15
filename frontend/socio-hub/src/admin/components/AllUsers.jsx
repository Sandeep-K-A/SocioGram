import { Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BasicModal from "./BasicModal";
import apiInstance from "../../utils/apiInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllUsers = () => {
  const [allUsersData, setAllUsersData] = useState([]);
  const [allUsersMessage, setAllUsersMessage] = useState("");
  const [trigger, setTrigger] = useState(0);
  const admin = useSelector((state) => state.admin);

  let token = admin.token;
  const headers = {
    authorization: token,
  };

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [actionToPerform, setActionToPerform] = useState("");
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async (headers) => {
      try {
        let response = await apiInstance.get("/admin/allusers", { headers });
        const { users, success, message } = response.data;
        if (success) {
          setAllUsersData(users);
          console.log(allUsersData[1].status);
        } else {
          setAllUsersMessage(message);
        }
      } catch (error) {
        console.error(`API Error ${error}`);
      }
    };
    fetchData(headers);
  }, [trigger]);

  const openConfirmationModal = (action, userId) => {
    setActionToPerform(action);
    setIsConfirmationModalOpen(true);
    setUserIdToDelete(userId);
  };

  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
    setActionToPerform("");
    setUserIdToDelete(null);
  };

  const handleConfirmedAction = () => {
    if (actionToPerform === "block" || actionToPerform === "unblock") {
      // Call the 'changeUserStatus' function with userId
      changeUserStatus(userIdToDelete);
    } else if (actionToPerform === "delete") {
      // Call the 'deleteUser' function with userIdToDelete
      deleteUser(userIdToDelete);
    }
    // Close the confirmation modal
    closeConfirmationModal();
  };

  const changeUserStatus = async (userId) => {
    console.log(userId);
    try {
      let response = await apiInstance.get(
        `/admin/change-user-access/${userId}`,
        { headers }
      );
      if (response.data.success) {
        setTrigger((prevTrigger) => prevTrigger + 1);
        toast.success("User access changed successfully.");
      } else {
        console.log(response.data.message);
        toast.error("Failed to change the user access.");
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };

  const deleteUser = async (userId) => {
    try {
      let response = await apiInstance.delete(`/admin/delete-user/${userId}`, {
        headers,
      });
      const { success, message } = response.data;
      if (success) {
        setTrigger((prevTrigger) => prevTrigger + 1);
        toast.success("User deleted successfully.");
      } else {
        console.log(message);
        toast.error("Failed to delete user.");
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };
  return (
    <div className="flex flex-col">
      <div className="font-semibold text-4xl mt-5 mb-8">Manage Users</div>
      {allUsersMessage ? (
        allUsersMessage
      ) : (
        <div className="rounded-2xl w-1200px bg-white">
          <table className="item-center w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-base border-b-solid tracking-none whitespace-nowrap text-blue-500 opacity-70">
                  No.
                </th>
                <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-blue-500 opacity-70">
                  userId
                </th>
                <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-blue-500 opacity-70">
                  UserName
                </th>
                <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-blue-500 opacity-70">
                  Email
                </th>
                <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-blue-500 opacity-70">
                  Access
                </th>
                <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-blue-500 opacity-70">
                  UserStatus
                </th>
                <th className="pr-6 pl-16 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-blue-500 opacity-70">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {allUsersData &&
                allUsersData.map((user, index) => (
                  <tr key={user.userId}>
                    <td className="px-6 py-3 font-medium">{index + 1}</td>
                    <td className="px-6 py-3 font-medium">{user.userId}</td>
                    <td className="">
                      <div className="flex items-center">
                        <Avatar className="mt-2 mb-2 mr-4" />
                        <span className="font-medium">{user.userName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 font-medium">{user.email}</td>
                    <td className="px-6 py-3 font-medium">
                      {user.status ? (
                        <span className="text-green-500 font-semibold animate-pulse">
                          Granted
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold animate-bounce">
                          Denied
                        </span>
                      )}
                    </td>
                    <td className="pl-12 font-medium">online</td>
                    <td className="pr-6">
                      <div className="flex items-center justify-around mr-6">
                        {user.status ? (
                          <button
                            className="rounded-full h-8 w-24 bg-orange-400 cursor-pointer"
                            onClick={() => {
                              openConfirmationModal("block", user.userId);
                            }}>
                            <span className="m-5 text-white text-sm font-medium">
                              Block
                            </span>
                          </button>
                        ) : (
                          <button
                            className="rounded-full h-8 w-24 bg-orange-200 cursor-pointer"
                            onClick={() => {
                              openConfirmationModal("unblock", user.userId);
                            }}>
                            <span className="m-5 text-white text-sm font-medium">
                              UnBlock
                            </span>
                          </button>
                        )}
                        <button
                          className="rounded-full h-8 bg-red-600 cursor-pointer"
                          onClick={() =>
                            openConfirmationModal("delete", user.userId)
                          }>
                          <span className="m-5 text-white text-sm font-medium">
                            Delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      {isConfirmationModalOpen && (
        <BasicModal
          isOpen={isConfirmationModalOpen}
          onClose={closeConfirmationModal}
          onProceed={handleConfirmedAction}
          actionText={`${actionToPerform}`} // Customize the modal title
        />
      )}
    </div>
  );
};

export default AllUsers;
