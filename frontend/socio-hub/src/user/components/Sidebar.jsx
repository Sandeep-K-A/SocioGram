import { GoHomeFill } from "react-icons/go";
import { RiListSettingsFill, RiUserSettingsFill } from "react-icons/ri";
import { FiSearch, FiSend, FiHeart } from "react-icons/fi";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  MdOutlineExplore,
  MdAddCircleOutline,
  MdOutlineSecurity,
} from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";
import { LuSettings2 } from "react-icons/lu";
import { CiLogout } from "react-icons/ci";
import { logout } from "../../utils/store/userSlice";
import apiInstance from "../../utils/apiInstance";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState, useCallback } from "react";
import EditProfileModal from "./EditProfileModal";
import PersonalSettingsModal from "./PersonalSettingsModal";
import CreatePostModal from "./CreatePostModal";
import Notification from "./Notification";
import { useSelector } from "react-redux";
import { Modal, Box, Avatar } from "@mui/material";
import debounce from "lodash.debounce";
function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const userId = user.userId;
  const profilePic = user.profilePic;
  const token = user.token;
  const userLogout = async () => {
    try {
      await apiInstance.post("/logout");
      dispatch(logout());
      navigate("/signin");
    } catch (error) {
      console.error(`API error ${error}`);
    }
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenuOpen = () => {
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
    setMenuOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [personalModalOpen, setPersonalModalOpen] = useState(false);
  const handlePersonalOpen = () => {
    setPersonalModalOpen(true);
    setMenuOpen(false);
  };
  const handlePersonalClose = () => {
    setPersonalModalOpen(false);
  };

  const [createPostModalOpen, setCreatePostModalOpen] = useState(false);
  const hanldePostModalOpen = () => {
    setCreatePostModalOpen(true);
  };
  const handlePostModalClose = () => {
    setCreatePostModalOpen(false);
  };

  const [notificationModal, setNotificationModal] = useState(false);
  const handleNotificationOpen = () => {
    setNotificationModal(true);
  };
  const handleNotificationClose = () => {
    setNotificationModal(false);
  };
  const [searchModal, setSearchModal] = useState(false);
  const handleSearchOpen = () => {
    setSearchModal(true);
  };
  const handleSearchClose = () => {
    setSearchModal(false);
  };
  const [searchLoading, setSearchLoading] = useState(false);
  const handleSearchLoading = () => {
    setSearchLoading(true);
  };
  const handleSearchFinish = () => {
    setSearchLoading(false);
  };
  const [searchTerm, setSearchTerm] = useState("");
  // const searchTermRef = useRef(searchTerm);
  // searchTermRef.current = searchTerm;
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = (event) => {
    try {
      handleSearchLoading();
      const { value } = event.target;
      setSearchTerm(value);
      debounceRequest(value);
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };

  const debouncedSearch = debounce(async (value) => {
    console.log("debounced Search is called once", value);
    try {
      await handleSearch(value);
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  }, 500); // Debounce for 300 milliseconds // Debounce for 300 milliseconds

  const debounceRequest = useCallback((value) => debouncedSearch(value), []);

  const handleSearch = async (value) => {
    try {
      const response = await apiInstance.get(`/user-search?userName=${value}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { success, users } = response.data;
      if (success) {
        setSearchResults(users);
        handleSearchFinish();
      } else {
        setSearchResults([]);
        handleSearchFinish();
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };
  const clearSearch = () => {
    setSearchTerm("");
    handleSearchChange({ target: { value: "" } });
  };
  // useEffect(() => {
  //   searchTermRef.current = searchTerm;
  // }, [searchTerm]);
  return (
    <div className="fixed flex flex-col justify-between z-1">
      <div
        className="m-6 font-bold text-3xl cursor-pointer"
        onClick={() => {
          navigate("/");
        }}>
        <span className="text-green-600">Socio</span>Gram
      </div>
      <div className="flex flex-col">
        <button
          onClick={() => {
            navigate("/");
          }}
          className="flex items-center bg-transparent mx-6 my-2 rounded-md w-full hover:cursor-pointer hover:bg-slate-300 hover:bg-opacity-50">
          <GoHomeFill className="h-7 w-7" />
          <span className="font-semibold text-17 leading-28 p-2">Home</span>
        </button>
        <button
          className="flex items-center bg-transparent mx-6 my-2  rounded-md w-full hover:cursor-pointer hover:bg-slate-300 hover:bg-opacity-50"
          onClick={handleSearchOpen}>
          <FiSearch className="h-7 w-7" />
          <span className="font-base text-17 leading-28 p-2">Search</span>
        </button>
        <button className="flex items-center bg-transparent mx-6 my-2  rounded-md w-full hover:cursor-pointer hover:bg-slate-300 hover:bg-opacity-50">
          <MdOutlineExplore className="h-7 w-7" />
          <span className="font-base text-17 leading-28 p-2">Explore</span>
        </button>
        <button className="flex items-center bg-transparent mx-6 my-2  rounded-md w-full hover:cursor-pointer hover:bg-slate-300 hover:bg-opacity-50">
          <FiSend className="h-7 w-7" />
          <span
            className="font-base text-17 leading-28 p-2"
            onClick={() => navigate("/messenger")}>
            Messages
          </span>
        </button>
        <button
          onClick={handleNotificationOpen}
          className="flex items-center bg-transparent mx-6 my-2  rounded-md w-full hover:cursor-pointer hover:bg-slate-300 hover:bg-opacity-50">
          <FiHeart className="h-7 w-7" />
          <span className="font-base text-17 leading-28 p-2">
            Notifications
          </span>
        </button>
        <button
          onClick={() => navigate(`/profile/${userId}`)}
          className="flex items-center bg-transparent mx-6 my-2  rounded-md w-full hover:cursor-pointer hover:bg-slate-300 hover:bg-opacity-50">
          {/* <FiHeart className="h-7 w-7" /> */}
          <Avatar
            sx={{ width: 30, height: 30 }}
            src={profilePic}
          />
          <span className="font-base text-17 leading-28 p-2">Profile</span>
        </button>
        <button
          onClick={hanldePostModalOpen}
          className="flex items-center bg-transparent mx-6 my-2  rounded-md w-full hover:cursor-pointer hover:bg-slate-300 hover:bg-opacity-50">
          <MdAddCircleOutline className="h-7 w-7" />
          <span className="font-base text-17 leading-28 p-2">Create</span>
        </button>
      </div>
      <div className="fixed bottom-6">
        <button
          id="settings"
          onClick={handleMenuOpen}
          className="flex items-center bg-transparent mx-6 my-2  rounded-md w-full hover:cursor-pointer hover:bg-slate-300 hover:bg-opacity-50">
          <LuSettings2 className="h-7 w-7" />
          <span className="font-base text-17 leading-28 p-2">Settings</span>
        </button>
      </div>
      {menuOpen && (
        <Menu
          anchorEl={document.getElementById("settings")}
          open={menuOpen}
          onClose={handleMenuClose}>
          <MenuItem onClick={handleOpen}>
            <RiListSettingsFill className="h-8 w-8 pr-2" />
            Edit Profile
          </MenuItem>
          <MenuItem onClick={handlePersonalOpen}>
            <RiUserSettingsFill className="h-8 w-8 pr-2" />
            Personal Setting
          </MenuItem>
          <MenuItem>
            <MdOutlineSecurity className="h-8 w-8 pr-2" />
            Password & Security
          </MenuItem>
          <MenuItem onClick={userLogout}>
            <CiLogout className="h-8 w-8 pr-2" />
            Logout
          </MenuItem>
        </Menu>
      )}
      {open && (
        <EditProfileModal
          isOpen={open}
          onClose={handleClose}
        />
      )}

      {personalModalOpen && (
        <PersonalSettingsModal
          isOpen={personalModalOpen}
          onClose={handlePersonalClose}
        />
      )}

      {createPostModalOpen && (
        <CreatePostModal
          isOpen={createPostModalOpen}
          onClose={handlePostModalClose}
        />
      )}
      {notificationModal && (
        <Notification
          isOpen={notificationModal}
          onClose={handleNotificationClose}
        />
      )}
      {searchModal && (
        <div>
          <Modal
            open={searchModal}
            onClose={handleSearchClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box
              sx={{ width: "30%", height: "70%" }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-400 bg-slate-950 shadow-lg rounded-2xl">
              <div className="font-semibold text-2xl text-white m-6">
                Search
              </div>
              <div className="flex flex-col items-center ">
                <div className="flex h-10 w-410px items-center bg-white rounded-lg">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-360px rounded-lg h-10 ml-4 outline-none bg-white"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  {searchLoading ? (
                    <LoadingButton loading>Submit</LoadingButton>
                  ) : (
                    <IoIosCloseCircle
                      className="w-5 h-5 ml-2 cursor-pointer"
                      onClick={clearSearch}
                    />
                  )}
                </div>
              </div>
              <div className="border-b border-white mt-7 mb-5"></div>
              <div className="flex flex-col overflow-y-auto max-h-[400px]">
                <style>
                  {`
                     ::-webkit-scrollbar {width: 0.5em;}
                 `}
                </style>
                {searchResults
                  ? searchResults.map((result) => (
                      <div
                        className="flex items-center py-2 pl-6 hover:bg-slate-500 cursor-pointer"
                        key={result.userId}
                        onClick={() => navigate(`/profile/${result.userId}`)}>
                        <Avatar
                          sx={{ width: 50, height: 50 }}
                          src={result?.profilePic}
                        />
                        <div className="flex flex-col text-sm ml-3">
                          <span className="text-white font-medium">
                            {result?.userName}
                          </span>
                          <span className="text-slate-200">
                            {result?.profileName}
                          </span>
                        </div>
                      </div>
                    ))
                  : ""}
              </div>
            </Box>
          </Modal>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
