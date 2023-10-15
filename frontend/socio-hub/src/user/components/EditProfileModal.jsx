import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CircularProgress from "@mui/material/CircularProgress";
import { Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { useSelector } from "react-redux";
import apiInstance from "../../utils/apiInstance";
import { useFormik } from "formik";
import * as yup from "yup";
import { updateUserName, updateProfilePic } from "../../utils/store/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function ChildModal({ isOpen, onClose, setProfileImage }) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const handleClose = () => {
    setSelectedImage(null);
    onClose();
  };
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const user = useSelector((state) => state.user);
  const userId = user.userId;
  const token = user.token;

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("image", selectedImage);
      const response = await apiInstance.post(
        `/edit-profile-profilepic/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
          },
        }
      );
      console.log(response);
      if (response.data.success) {
        console.log("success,.,m.m.m.m.,m.,m.,m");
        setProfileImage(response.profilePic);
        dispatch(updateProfilePic(response.data.profilePic));
        //add the profilePic to store also
        handleClose();
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description">
        <Box className="w-full mt-40 max-w-sm p-6 bg-white mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center">
              <CircularProgress />
            </div>
          ) : (
            <Card sx={{ maxWidth: 345 }}>
              <CardActionArea>
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div">
                    Upload Profile Photo
                  </Typography>
                  {selectedImage && (
                    <CardMedia
                      component="img"
                      height="140"
                      src={URL.createObjectURL(selectedImage)}
                      alt="green iguana"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <div className="flex justify-around mt-3">
                    <div
                      className="rounded-full px-3 py-2 text-black bg-blue-500"
                      onClick={handleSubmit}>
                      Submit
                    </div>
                    <div
                      className="rounded-full px-3 py-2 text-white bg-red-500"
                      onClick={handleClose}>
                      Cancel
                    </div>
                  </div>
                </CardContent>
              </CardActionArea>
            </Card>
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default function EditProfileModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const userId = user.userId;
  const token = user.token;
  const handleClose = () => {
    onClose();
  };
  const userNameRules = /^[A-Za-z0-9_]{1,20}$/;
  const profileNameRules = /^[A-Za-z\s]{1,20}$/;
  const bioRules = /^\s*(.{1,30})\s*$/;

  const [userDetails, setUserDetails] = useState({
    profilePic: "",
    userName: "",
  });

  const initialValues = {
    userName: "",
    profileName: "",
    bio: "",
    gender: "",
  };

  const validationSchema = yup.object().shape({
    userName: yup
      .string()
      .matches(userNameRules, {
        message: "userName must not contain any special characters..",
      })
      .required("userName is required"),
    profileName: yup
      .string()
      .matches(profileNameRules, {
        message: "profileName must not contain any special characters",
      })
      .required("profileName is required"),
    bio: yup
      .string()
      .matches(bioRules, { message: "bio must not exceed 30 characters" }),
  });

  const onSubmit = async (values) => {
    try {
      const response = await apiInstance.patch(
        `/edit-profile/${userId}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { success, message, user } = response.data;
      console.log(response.data);
      if (success) {
        dispatch(updateUserName({ user }));
        handleClose();
        navigate(`/profile/${userId}`);
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };

  const {
    values,
    errors,
    handleBlur,
    handleChange,
    touched,
    handleSubmit,
    setValues,
  } = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: false, // Default behavior (disabled)
    validateOnBlur: true, // Default behavior (enabled)
    onSubmit,
  });

  const [openImageModal, setOpenImageModal] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  const handleOpenImageModal = () => {
    setOpenImageModal(true);
  };

  const handleCloseImageModal = () => {
    setOpenImageModal(false);
  };

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        let response = await apiInstance.get(`/edit-profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        let { success, user } = response.data;
        if (success) {
          setValues({
            userName: user.userName,
            profileName: user.profileName,
            bio: user.bio,
            gender: user.gender,
          });
          setUserDetails({
            profilePic: user.profilePic,
            userName: user.userName,
          });
        }
      } catch (error) {
        console.error(`API Error ${error}`);
      }
    }
    fetchUserDetails();
  }, [setValues]);
  return (
    <div>
      <div className="text-center">
        <Modal
          open={isOpen}
          onClose={handleClose}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description">
          <Box
            className="w-full mt-32 p-6 bg-white mx-auto"
            sx={{ width: "40%", height: "70%" }}>
            <div className="">
              <div className="font-semibold pl-16 justify-center text-3xl">
                <span>Edit Profile</span>
              </div>
              <div className="flex flex-col justify-center items-center mr-48 mb-10">
                <div className="flex m-5">
                  <div className="mr-10">
                    <Avatar
                      src={userDetails.profilePic}
                      className="!w-16 !h-16"
                    />
                  </div>
                  <div className="flex flex-col font-medium mt-1">
                    <span>{userDetails.userName}</span>
                    <span
                      className="text-blue-600 hover:text-black cursor-pointer"
                      onClick={handleOpenImageModal}>
                      changeProfilePhoto
                    </span>
                  </div>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="flex mb-5 justify-around gap-4 items-center pl-24">
                    <label
                      className="font-medium text-base"
                      htmlFor="">
                      UserName
                    </label>
                    <input
                      className="bg-gray-200 outline-none h-8  w-64 p-5"
                      type="text"
                      name="userName"
                      value={values.userName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="flex justify-end items-end mr-3 mb-2">
                    {" "}
                    {errors.userName && touched.userName && (
                      <p className="text-red-600 font-normal text-xs">
                        {errors.userName}
                      </p>
                    )}
                  </div>
                  <div className="flex mb-5 justify-between gap-10 items-center pl-22 mr-3">
                    <label
                      className="font-medium text-base "
                      htmlFor="">
                      ProfileName
                    </label>
                    <input
                      className="bg-gray-200 outline-none h-8  w-64 p-5"
                      type="text"
                      name="profileName"
                      value={values.profileName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="flex justify-end items-end mr-3 mb-2">
                    {" "}
                    {errors.profileName && touched.profileName && (
                      <p className="text-red-600 font-normal text-xs">
                        {errors.profileName}
                      </p>
                    )}
                  </div>
                  <div className="flex mb-5 justify-center gap-10 items-center pl-36">
                    <label
                      className="font-medium text-base"
                      htmlFor="">
                      Bio
                    </label>
                    <input
                      className="bg-gray-200 outline-none h-16 w-64 p-5"
                      type="text"
                      name="bio"
                      value={values.bio}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="flex justify-end items-end mr-3 mb-2">
                    {" "}
                    {errors.bio && touched.bio && (
                      <p className="text-red-600 font-normal text-xs">
                        {errors.bio}
                      </p>
                    )}
                  </div>
                  <div className="flex mb-5 justify-center items-center gap-10 pl-28">
                    <label
                      className="font-medium text-base "
                      htmlFor="">
                      Gender
                    </label>
                    <select
                      className="bg-gray-200 outline-none h-8 w-64"
                      type="text"
                      name="gender"
                      value={values.gender}
                      onChange={handleChange}
                      onBlur={handleBlur}>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="inline text-sm cursor-pointer font-semibold px-3 py-2 ml-28 mt-15 border text-white bg-blue-500 rounded-full">
                    Submit
                  </button>
                </form>
              </div>
            </div>
            <ChildModal
              isOpen={openImageModal}
              onClose={handleCloseImageModal}
              setProfileImage={setProfileImage}
            />
          </Box>
        </Modal>
      </div>
    </div>
  );
}
