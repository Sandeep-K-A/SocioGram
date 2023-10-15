import { FaRegEnvelope } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import { useFormik } from "formik";
import signinValidation from "../../utils/validationSchema/signinValidation";
import { useState, useEffect } from "react";
import apiInstance from "../../utils/apiInstance";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../utils/store/userSlice";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { Box, Modal } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const isLoggedIn = user.success;

  const [signinError, setSigninError] = useState("");
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const [forgotPassModal, setForgotPassModal] = useState(false);
  const [forgotPassEmail, setForgotPassEmail] = useState("");
  const [forgotPassValidation, setForgotPassValidation] = useState("");
  const [forgotPassSuccess, setForgotPassSuccess] = useState("");
  const [forgotPassError, setForgotPassError] = useState("");
  const [loading, setLoading] = useState(false);
  // const [emailValidationError, setEmailValidationError] = useState(
  //   " Enter a valid email address"
  // );

  const openForgotPass = () => {
    setForgotPassModal(true);
  };

  const closeForgotPass = () => {
    setForgotPassModal(false);
  };

  const handleEmailChange = (event) => {
    console.log("handle Email change accessed");
    let newEmail = event.target.value;
    setForgotPassEmail(newEmail);
    const emailRules = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRules.test(forgotPassEmail)) {
      setForgotPassValidation("Enter a complete and valid email");
    } else {
      setForgotPassValidation("");
    }
  };

  const onSubmitEmail = async () => {
    try {
      if (forgotPassEmail == "" || forgotPassValidation) {
        setForgotPassValidation("Please complete the field without any errors");
        return;
      }
      setLoading(true);
      const requestBody = { forgotPassEmail };
      const response = await apiInstance.post(`/forgot-password`, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { success, message } = response.data;
      if (success) {
        setForgotPassSuccess(message);
        setLoading(false);
      } else {
        setForgotPassError(message);
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };
  const onSubmit = async (values) => {
    try {
      const response = await apiInstance.post("/signin", values);
      const { user, success, message, token } = response.data;

      if (success) {
        dispatch(login({ user, success, token }));
        navigate("/");
      } else {
        setSigninError(message);
      }
    } catch (error) {
      console.error(`API error ${error}`);
    }
  };
  const handleGoogleSignin = async (decoded) => {
    try {
      const googleId = decoded.sub;
      let response = await apiInstance.post(`signin-google/${googleId}`);
      const { success, user, message, token } = response.data;
      if (success) {
        dispatch(login({ user, success, token }));
        navigate("/");
      } else {
        setSigninError(message);
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: signinValidation,
      validateOnChange: false, // Default behavior (disabled)
      validateOnBlur: true, // Default behavior (enabled)
      onSubmit,
    });
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex w-50 rounded-2xl max-w-4x shadow-2xl ">
        <div className="w-3/5 p-5">
          <div className="text-left font-bold text-lg">
            <span className="text-green-600">Socio</span>Gram
          </div>
          <div className="flex flex-col justify-center items-center py-10">
            <h2 className="text-3xl font-bold text-green-600 mb-2">
              Sign in to Account
            </h2>
            <div className="border-2 w-14 border-green-600 mb-2 mx-auto"></div>
            <p className="text-gray-400 my-6">use your email and password.</p>
            <div className="flex flex-col items-center">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center">
                <div className="bg-gray-200 w-64 p-2 flex items-center mb-3">
                  <FaRegEnvelope className="text-gray-400 m-2" />
                  <input
                    className="bg-gray-200 outline-none text-sm flex-1"
                    autoComplete="off"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  {" "}
                  {errors.email && touched.email && (
                    <p className="text-red-600 font-normal text-xs">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="bg-gray-200 w-64 p-2 flex items-center">
                  <MdLockOutline className="text-gray-400 m-2" />
                  <input
                    className="bg-gray-200 outline-none text-sm flex-1"
                    autoComplete="off"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  {" "}
                  {errors.password && touched.password && (
                    <p className="text-red-600 font-normal text-xs">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div className="flex w-64 m-2 justify-between">
                  <a
                    href="#"
                    className="text-xs text-gray-800"></a>
                  <a
                    href="#"
                    onClick={openForgotPass}
                    className="text-xs text-gray-800">
                    ForgotPassword?
                  </a>
                </div>
                <button
                  type="submit"
                  className="border-green-600 text-green-600 border-2 inline-block rounded-full mt-10 px-6 py-1.5 font-semibold hover:bg-green-600 hover:text-white">
                  Sign in
                </button>
              </form>
              {signinError && (
                <div className="text-red-600 font-normal text-sm">
                  {signinError}
                </div>
              )}
              <span>or</span>
              <div>
                <GoogleOAuthProvider clientId={clientId}>
                  <GoogleLogin
                    size="medium"
                    onSuccess={(credentialResponse) => {
                      let decoded = jwt_decode(credentialResponse.credential);
                      handleGoogleSignin(decoded);
                    }}
                    onError={() => {
                      console.log("login failed");
                    }}></GoogleLogin>
                </GoogleOAuthProvider>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-green-600 w-2/5 rounded-br-2xl rounded-tr-2xl text-white py-36 px-12 flex flex-col justify-center items-center text-center">
          <h2 className="text-3xl font-bold mb-2">Hello, Friend!</h2>
          <div className="border-2 w-14 border-white mb-2 mx-auto"></div>
          <p className="font-normal mb-1">
            Fill up personal information and start journey with us.
          </p>
          <button
            onClick={() => {
              navigate("/signup");
            }}
            className="border-white border-2 inline-block rounded-full mt-10 px-6 py-1.5 font-semibold hover:bg-white hover:text-green-600">
            Sign up
          </button>
        </div>
      </div>
      {forgotPassModal && (
        <Modal
          open={forgotPassModal}
          onClose={closeForgotPass}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description">
          <Box
            sx={{ width: "35%", height: "40%" }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-400 bg-slate-100 shadow-lg rounded-2xl">
            <div className="flex flex-col justify-center">
              <div className="text-black font-bold text-xl mt-2 ml-48">
                Password Reset
              </div>
              <div className="text-orange-500 text-lg font-mediumm mb-5 mt-5 ml-5">
                Forgot your password ?
              </div>
              <div className="text-green-400 ml-5">
                Please enter the mail used in the signup to get the link for
                resetting the password
              </div>
              <div className="flex justify-between">
                <div className="bg-gray-200 w-4/5 p-2 flex items-center mb-3 ml-5 mt-5">
                  <FaRegEnvelope className="text-gray-400 m-2" />
                  <input
                    className="bg-gray-200 outline-none text-sm flex-1"
                    autoComplete="off"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={forgotPassEmail || ""}
                    onChange={handleEmailChange}
                  />
                </div>

                {loading ? (
                  <LoadingButton loading>submit</LoadingButton>
                ) : (
                  <button
                    className="text-blue-600 font-medium pr-5"
                    onClick={onSubmitEmail}>
                    Get link
                  </button>
                )}
              </div>
              {forgotPassValidation && (
                <div className="text-red-600 font-normal text-sm ml-5">
                  {forgotPassValidation}
                </div>
              )}
              {forgotPassSuccess && (
                <div className="text-green-600 font-normal text-sm ml-5">
                  {forgotPassSuccess}
                </div>
              )}
              {forgotPassError && (
                <div className="text-green-600 font-normal text-sm ml-5">
                  {forgotPassError}
                </div>
              )}
            </div>
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default Signin;
