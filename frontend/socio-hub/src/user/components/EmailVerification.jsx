import { useState, useEffect } from "react";
import { MdMailLock } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import apiInstance from "../../utils/apiInstance";
const EmailVerification = () => {
  const { user_id, verifyToken } = useParams();
  const [verifyEmail, setVerifyEmail] = useState(false);
  const navigate = useNavigate();

  const emailVerification = async () => {
    try {
      const response = await apiInstance.get(
        `/users/${user_id}/verify/${verifyToken}`
      );
      const { success } = response.data;
      if (success) {
        setVerifyEmail(true);
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };

  useEffect(() => {
    emailVerification();
  }, []);
  return (
    <div className="flex items-center justify-center">
      {verifyEmail ? (
        <div className="w-50 h-96 border rounded-2xl mt-20 bg-blue-300 shadow-2xl">
          <div className="flex flex-col justify-center items-center">
            <div className="font-bold text-3xl text-black mt-5 mb-5">
              Account Activated
            </div>
            <div>
              <MdMailLock
                className="w-24 h-24"
                style={{ fill: "blue" }}
              />
            </div>
            <div className="font-medium text-lg text-white my-5">
              thank you,Your email has been verified.Your account is now active.{" "}
              <br /> Please click the link below to signin to your Account.
            </div>
            <button
              className="px-4 py-2 rounded-md bg-green-500 text-white font-medium mt-2"
              onClick={() => navigate("/signin")}>
              Signin
            </button>
          </div>
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

export default EmailVerification;
