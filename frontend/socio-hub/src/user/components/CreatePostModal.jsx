import { Box, Modal } from "@mui/material";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiInstance from "../../utils/apiInstance";
import { useNavigate } from "react-router-dom";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
const CreatePostModal = ({ isOpen, onClose }) => {
  const handleClose = () => {
    onClose();
  };
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({ aspect: 1 / 1 });
  const [postText, setPostText] = useState("");

  const selectedImageRef = useRef(selectedImage);
  const postTextRef = useRef(postText);

  selectedImageRef.current = selectedImage;
  postTextRef.current = postText;

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // const reader = new FileReader();
      // reader.onload = (event) => {
      //   console.log(event.target.result);
      //   setSelectedImage(event.target.result);
      // };
      // reader.readAsDataURL(file);
      setSelectedImage(file);
    } else {
      setSelectedImage(null);
    }
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
  };

  const handleCropComplete = (crop) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const imageLoader = new Image();
    imageLoader.src = URL.createObjectURL(selectedImage);
    imageLoader.onload = () => {
      const scaleX = imageLoader.width / crop.width;
      const scaleY = imageLoader.height / crop.height;

      canvas.width = crop.width;
      canvas.height = crop.height;

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(
        imageLoader,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => {
        const newFile = new File([blob], `${selectedImage.name}`, {
          type: "image/jpeg",
        });
        setSelectedImage(newFile);
      }, "image/jpeg");
    };
  };

  const user = useSelector((state) => state.user);
  const userId = user.userId;
  const id = user.id;
  const token = user.token;

  const navigate = useNavigate();

  const submitPost = async () => {
    console.log("selectedImage:", selectedImageRef.current);
    console.log("postText:", postTextRef.current);
    try {
      if (!selectedImageRef.current) {
        toast.error("please select a image to make a new post");
        return;
      }
      if (!postTextRef.current) {
        toast.error("please add description for your post");
        return;
      }

      const formData = new FormData();
      formData.append("postImage", selectedImageRef.current);
      formData.append("postDescription", postTextRef.current);
      const response = await apiInstance.post(
        `/user-new-post/${userId}/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
          },
        }
      );
      const { success, message } = response.data;
      if (success) {
        handleClose();
        navigate(`/profile/${userId}`);
      } else {
        console.log(message);
      }
    } catch (error) {
      console.error(`API error ${error}`);
    }
  };

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-400 bg-slate-100 shadow-lg rounded-2xl"
          sx={{ width: "33%", height: "80%" }}>
          <div className="w-full flex flex-col justify-center ">
            <div className="h-10 border-b border-slate-900 text-slate-800 font-medium flex  items-center">
              <span className="flex-grow text-center pl-12">
                Create new post
              </span>
              <span
                className="font-medium text-sm text-blue-600 cursor-pointer pr-5"
                onClick={submitPost}>
                share
              </span>
            </div>
            <div className="">
              {selectedImage ? (
                <div className="mb-2 relative">
                  <button
                    className="absolute top-2 right-2 bg-transparent text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer animate-bounce"
                    onClick={clearSelectedImage}>
                    X
                  </button>
                  {/* <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected"
                    className="h-96 mx-auto"
                  /> */}
                  <ReactCrop
                    className="h-96 mx-auto"
                    crop={crop}
                    onChange={(newCrop) => setCrop(newCrop)}
                    onComplete={handleCropComplete}>
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt=""
                    />
                  </ReactCrop>
                </div>
              ) : (
                <div className="mt-8">
                  <label
                    htmlFor="imageInput"
                    className="block w-full text-blue-500 hover:text-blue-700 text-4xl text-center cursor-pointer">
                    <img
                      src="/createPostImage.png"
                      alt="Placeholder"
                      className="max-h-80 mx-auto mb-3 opacity-70"
                    />
                    <span className="inline-block text-base font-medium bg-blue-500 p-2 rounded-xl  text-white">
                      Select Image from Computer
                    </span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    name="postImage"
                    className="hidden"
                    id="imageInput"
                    onChange={handleImageChange}
                  />
                </div>
              )}
            </div>
            <div className="mt-3 mx-2">
              <input
                type="text"
                placeholder="Write your post here..."
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                className="bg-slate-100 text-slate-800 border rounded-2xl border-slate-700  p-2 w-full h-24 outline-none"
              />
            </div>
            {/* <div className="font-medium text-blue-500">
              <span>share</span>
            </div> */}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default CreatePostModal;
