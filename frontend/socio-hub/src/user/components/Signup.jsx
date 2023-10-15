import { FaRegEnvelope } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { TfiUser } from "react-icons/tfi";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import apiInstance from "../../utils/apiInstance";
import { useSelector, useDispatch } from "react-redux";
import signupValidation from "../../utils/validationSchema/signupValidation";
import { login } from "../../utils/store/userSlice";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const isLoggedIn = user.success;
  const clientId = import.meta.env.VITE_CLIENT_ID;
  console.log(clientId, "OOOOOOO");
  const [userExistError, setUserExistError] = useState("");
  const [verifyMessage, setVerifyMessage] = useState("");

  const onSubmit = async (values) => {
    try {
      const response = await apiInstance.post("/signup", values);
      const { user, success, message } = response.data;
      console.log(user);
      if (success) {
        // console.log("user signup success going to dispatch action");

        // dispatch(login({ user, success, message, token }));
        setVerifyMessage(message);
        // navigate("/");
      } else {
        setUserExistError(message);
      }
    } catch (error) {
      console.error(`API error:${error}`);
    }
  };
  const handleGoogleSignup = async (decoded) => {
    try {
      const fullName = decoded.name;
      const firstName = decoded.given_name;
      const lastName = decoded.family_name;
      const email = decoded.email;
      const profilePic = decoded.picture;
      const googleId = decoded.sub;

      const userData = {
        fullName,
        firstName,
        lastName,
        email,
        profilePic,
        googleId,
      };
      const encodedData = encodeURIComponent(JSON.stringify(userData));
      const requestBody = `userData=${encodedData}`;

      let response = await apiInstance.post("/signup-google", requestBody, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      const { user, success, message, token } = response.data;
      if (success) {
        console.log("user signup success going to dispatch action");

        dispatch(login({ user, success, token }));
        navigate("/");
      } else {
        setUserExistError(message);
      }
    } catch (error) {
      console.error(`API error:${error}`);
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
        fullName: "",
        userName: "",
        email: "",

        password: "",
      },
      validationSchema: signupValidation,
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
              Create a new Account
            </h2>
            <div className="border-2 w-14 border-green-600 mb-8 mx-auto"></div>
            {/* <p className="text-gray-400 my-6">use your email and password.</p> */}
            <div className="flex flex-col items-center">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center">
                <div className="bg-gray-200 w-64 p-2 flex items-center mb-3">
                  <TfiUser className="text-gray-400 m-2" />
                  <input
                    className="bg-gray-200 outline-none text-sm flex-1"
                    autoComplete="off"
                    type="text"
                    name="fullName"
                    placeholder="FullName"
                    value={values.fullName}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  {" "}
                  {errors.fullName && touched.fullName && (
                    <p className="text-red-600 font-normal text-xs">
                      {errors.fullName}
                    </p>
                  )}
                </div>
                <div className="bg-gray-200 w-64 p-2 flex items-center mb-3">
                  <FiUser className="text-gray-400 m-2" />
                  <input
                    className="bg-gray-200 outline-none text-sm flex-1 "
                    autoComplete="off"
                    type="text"
                    name="userName"
                    placeholder="UserName"
                    value={values.userName}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  {" "}
                  {errors.userName && touched.userName && (
                    <p className="text-red-600 font-normal text-xs">
                      {errors.userName}
                    </p>
                  )}
                </div>
                <div className="bg-gray-200 w-64 p-2 flex items-center mb-3">
                  <FaRegEnvelope className="text-gray-400 m-2" />
                  <input
                    className="bg-gray-200 outline-none text-sm flex-1"
                    autoComplete="off"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={values.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
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
                {/* <div className="bg-gray-200 w-64 p-2 flex items-center mb-3">
                  <FiPhone className="text-gray-400 m-2" />
                  <input
                    className="bg-gray-200 outline-none text-sm flex-1"
                    autoComplete="off"
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={values.phone}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </div> */}
                <div>
                  {" "}
                  {errors.phone && touched.phone && (
                    <p className="text-red-600 font-normal text-xs">
                      {errors.phone}
                    </p>
                  )}
                </div>
                <div className="bg-gray-200 w-64 p-2 flex items-center mb-3">
                  <MdLockOutline className="text-gray-400 m-2" />
                  <input
                    className="bg-gray-200 outline-none text-sm flex-1"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={values.password}
                    onBlur={handleBlur}
                    onChange={handleChange}
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
                <button
                  type="submit"
                  className="border-green-600 text-green-600 border-2 inline-block rounded-full mt-2 px-6 py-1.5 font-semibold hover:bg-green-600 hover:text-white">
                  Sign up
                </button>
              </form>
              {userExistError && (
                <div className="text-red-600 font-normal text-sm">
                  {userExistError}
                </div>
              )}
              {verifyMessage && (
                <div className="text-green-600 font-normal text-sm">
                  {verifyMessage}
                </div>
              )}
              <span>or</span>
              <div className="w-60 ml-14">
                {" "}
                <GoogleOAuthProvider clientId={clientId}>
                  <GoogleLogin
                    text="signup_with"
                    size="medium"
                    onSuccess={(credentialResponse) => {
                      let decoded = jwt_decode(credentialResponse.credential);
                      console.log(decoded);
                      handleGoogleSignup(decoded);
                    }}
                    onError={() => {
                      console.log("Login Failed");
                    }}
                  />
                </GoogleOAuthProvider>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-green-600 w-2/5 rounded-br-2xl rounded-tr-2xl text-white py-36 px-12 flex flex-col justify-center items-center text-center">
          <h2 className="text-3xl font-bold mb-2">Hello, Friend!</h2>
          <div className="border-2 w-14 border-white mb-2 mx-auto"></div>
          <p className="font-normal mb-1">
            Already started the journey continue here.
          </p>
          <button
            onClick={() => {
              navigate("/signin");
            }}
            className="border-white border-2 inline-block rounded-full mt-10 px-6 py-1.5 font-semibold hover:bg-white hover:text-green-600">
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
