import { MdLockOutline } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import apiInstance from "../../utils/apiInstance";
import RedirectModal from "./RedirectModal";

const ForgotPassword = () => {
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPassError, setConfirmPassError] = useState("");
  const [nullError, setNullError] = useState("");
  const { user_id, verifyToken } = useParams();
  const [successModal, setSuccessModal] = useState(false);

  const handleSuccessOpen = () => {
    console.log("accessed");
    setSuccessModal(true);
  };
  const handleSuccessClose = () => {
    setSuccessModal(false);
  };
  const forgotPasswordVerification = async () => {
    try {
      const response = await apiInstance.get(
        `/users/${user_id}/forgot-password/${verifyToken}`
      );
      const { success } = response.data;
      if (success) {
        setVerifySuccess(success);
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    const passwordRules =
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+-]).{5,}$/;
    if (!passwordRules.test(newPassword)) {
      setPasswordError(
        "Password must contain at least one Upper-case letter, one digit, and one special character, and be at least 5 characters long."
      );
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPassChange = (event) => {
    const samePassword = event.target.value;
    setConfirmPassword(samePassword);
    if (password != samePassword) {
      setConfirmPassError("Please Enter the same password");
    } else {
      setConfirmPassError("");
    }
  };

  const handleForgotPassword = async () => {
    try {
      if (password == "" || confirmPassword == "") {
        setNullError("Please fill all the fields and try again.");
        return;
      }
      if (passwordError || confirmPassError) {
        setNullError("Please fix all the error and try again");
        return;
      }
      const requrestBody = { password };
      const response = await apiInstance.patch(
        `/user/password-change/${user_id}`,
        requrestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { success } = response.data;
      if (success) {
        setNullError("");
        handleSuccessOpen();
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };
  useEffect(() => {
    forgotPasswordVerification();
  }, []);
  return (
    <div className="flex justify-center items-center">
      {verifySuccess ? (
        <div className="flex flex-col ml- mt-20 w-550 h-auto shadow-xl rounded-xl bg-gray-200">
          <div className="text-black font-bold text-3xl mt-12 ml-44">
            Password Reset
          </div>
          <div className="mt-5 ml-32 text-green-600 font-medium text-lg">
            Make a new Password for your account
          </div>
          <div className="bg-gray-50 w-64 flex items-center mb-3 ml-40 mt-5">
            <MdLockOutline className="text-gray-400 m-2" />
            <input
              className="bg-gray-50 outline-none text-sm flex-1"
              type="password"
              name="password"
              placeholder="Enter new Password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div>
            {" "}
            {passwordError && (
              <p className="text-red-600 font-normal text-xs">
                {passwordError}
              </p>
            )}
          </div>
          <div className="bg-gray-50 w-64 flex items-center mb-3 ml-40 mt-5">
            <MdLockOutline className="text-gray-400 m-2" />
            <input
              className="bg-gray-50 outline-none text-sm flex-1"
              type="password"
              name="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPassChange}
            />
          </div>
          <div>
            {" "}
            {confirmPassError && (
              <p className="text-red-600 font-normal text-xs ml-48">
                {confirmPassError}
              </p>
            )}
          </div>
          <div className="mt-4">
            {" "}
            {nullError && (
              <p className="text-red-600 font-normal text-xs">{nullError}</p>
            )}
          </div>
          <div
            className="bg-blue-500 w-52 px-2 py-2 ml-44 mt-5 mb-5 text-white font-medium cursor-pointer"
            onClick={handleForgotPassword}>
            <span className="ml-7">Save New Password</span>
          </div>
          {successModal && (
            <RedirectModal
              isOpen={successModal}
              onClose={handleSuccessClose}
            />
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-52">
          <div className="text-black font-extrabold text-5xl">Error 404</div>
          <div className="text-black font-medium text-2xl">Invalid Link</div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
