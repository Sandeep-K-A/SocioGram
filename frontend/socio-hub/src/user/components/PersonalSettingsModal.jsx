import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const PersonalSettingsModal = ({ isOpen, onClose }) => {
  const handleClose = () => {
    onClose();
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box
          className="w-full mt-32 p-6 bg-white mx-auto"
          sx={{ width: "40%", height: "50%" }}>
          <div>
            <div className="font-semibold pl-16 justify-center text-3xl">
              <span>Personal Settings</span>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default PersonalSettingsModal;
