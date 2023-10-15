import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Box } from "@mui/material";

const RedirectModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [countDown, setCountDown] = useState(5);
  useEffect(() => {
    let redirectTimer;

    if (isOpen) {
      redirectTimer = setInterval(() => {
        setCountDown((prevCountDown) => prevCountDown - 1);
      }, 1000);
    }

    return () => {
      clearInterval(redirectTimer);
    };
  }, [isOpen]);
  useEffect(() => {
    if (countDown === 0) {
      navigate("/signin");
      onClose();
    }
  });
  return (
    <div>
      <Modal
        open={isOpen}
        onClose={onclose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box
          sx={{ width: "35%", height: "40%" }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-400 bg-slate-100 shadow-lg rounded-2xl">
          <div className="flex flex-col justify-center items-center">
            <div className="text-green-500 font-extrabold text-3xl mt-20">
              Password Changed Successfully
            </div>
            <div className="text-blue-500 mt-5 text-lg">
              Redirecting to Signin in {countDown} seconds...
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default RedirectModal;
