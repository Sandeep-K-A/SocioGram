import { Modal, Box } from "@mui/material";
import { Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const ListsModal = ({ listModalOpen, listModalClose, list, text }) => {
  const [filteredFollowing, setFilteredFollowing] = useState([...list]);
  const [searchResult, setSearchResult] = useState([...filteredFollowing]);
  const navigate = useNavigate();
  const onClose = () => {
    listModalClose();
  };

  console.log(searchResult, "&&&&&&&&77");
  const handleChange = (search) => {
    console.log("handleCHange triggered");
    try {
      setSearchResult(...filteredFollowing);
      if (search != "") {
        // const filteredList = searchResult.filter(
        //   (value) =>
        //     value.userName == search.userName ||
        //     value.profileName == search.profileName
        const filteredList = searchResult.filter((value) => {
          const searchRegExp = new RegExp(search, "i");
          return (
            searchRegExp.test(value.userName) ||
            searchRegExp.test(value.profileName)
          );
        });
        // );
        setSearchResult(filteredList);
      } else {
        setSearchResult(filteredFollowing);
      }
      console.log(searchResult, "::::handle change");
    } catch (error) {
      console.error(`Search following error ${error}`);
    }
  };
  const handleNavigate = (userId) => {
    onClose();
    navigate(`/profile/${userId}`);
  };
  console.log(list, "{{{{{{{{{{{}}}}}}}}}}}}}}");
  useEffect(() => {}, [searchResult]);
  return (
    <div>
      <Modal
        open={listModalOpen}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box
          sx={{ width: "30%", height: "70%" }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-400 bg-slate-950 shadow-lg rounded-2xl">
          <div className="font-semibold text-2xl text-white m-6">{text}</div>
          <div className="flex flex-col items-center ">
            <div className="flex h-10 w-410px items-center bg-white rounded-lg">
              <input
                type="text"
                placeholder="Search"
                className="w-360px rounded-lg h-10 ml-4 outline-none bg-white"
                onChange={(e) => handleChange(e.target.value)}
              />
            </div>
          </div>
          <div className="border-b border-white mt-7 mb-5"></div>
          <div className="flex flex-col overflow-y-auto max-h-[400px]">
            <style>
              {`
                     ::-webkit-scrollbar {width: 0.5em;}
                 `}
            </style>
            {searchResult?.map((user) => (
              <div
                onClick={() => handleNavigate(user?.userId)}
                className="flex items-center py-2 pl-6 hover:bg-slate-500 cursor-pointer"
                key={user?._id}>
                <Avatar
                  sx={{ width: 50, height: 50 }}
                  src={user?.profilePic}
                />
                <div className="flex flex-col text-sm ml-3">
                  <span className="text-white font-medium">
                    {user?.userName}
                  </span>
                  <span className="text-slate-200">{user?.profileName}</span>
                </div>
              </div>
            ))}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ListsModal;
