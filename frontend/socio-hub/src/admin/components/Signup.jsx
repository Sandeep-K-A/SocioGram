import { FiUser } from "react-icons/fi";
import { FaRegEnvelope } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import apiInstance from "../../utils/apiInstance";
import { useNavigate } from "react-router-dom";
import { login } from "../../utils/store/adminSlice";
import signupValidation from "../../utils/validationSchema/signupValidation";
import * as yup from "yup";
import { useState, useEffect } from "react";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [adminSignupError, setAdminSignupError] = useState("");
  const admin = useSelector((state) => state.admin);

  const isLoggedIn = admin.isLoggedIn;

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/admin");
    }
  }, [isLoggedIn, navigate]);

  const initialValues = {
    userName: "",
    email: "",
    password: "",
  };

  const onSubmit = async (values) => {
    try {
      let response = await apiInstance.post("/admin/signup", values);
      const { admin, success, message, token } = response.data;
      if (success) {
        dispatch(login({ admin, success, token }));
        dispatch;
        navigate("/admin");
      } else {
        setAdminSignupError(message);
      }
    } catch (error) {
      console.error(`API error:${error}`);
    }
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: yup.object().shape({
        userName: signupValidation.fields.userName,
        email: signupValidation.fields.email,
        password: signupValidation.fields.password,
      }),
      validateOnChange: false, // Default behavior (disabled)
      validateOnBlur: true, // Default behavior (enabled)
      onSubmit,
    });
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col  w-450px rounded-xl shadow-2xl">
        <div className="text-left font-bold text-sm mb-5 ml-3 mt-3">
          <span className="text-green-600">Socio</span>Gram
          <span className="text-gray-500 p-2">Admin</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold text-green-600 mb-5">
            Create a new Account
          </h2>
          <form
            onSubmit={handleSubmit}
            className="mt-3 mb-8">
            <div className="bg-gray-200 w-64 p-2 flex items-center mb-3 rounded-full">
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
            <div className="bg-gray-200 w-64 p-2 flex items-center mb-3 rounded-full">
              <FaRegEnvelope className="text-gray-400 m-2" />
              <input
                className="bg-gray-200 outline-none text-sm flex-1 "
                autoComplete="off"
                type="text"
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
            <div className="bg-gray-200 w-64 p-2 flex items-center mb-3 rounded-full">
              <MdLockOutline className="text-gray-400 m-2" />
              <input
                className="bg-gray-200 outline-none text-sm flex-1 "
                autoComplete="off"
                type="text"
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
            <div className=" flex justify-center  text-sm text-gray-900">
              <span className="mr-2">already have an account?</span>
              <span
                className="text-blue-600 font-medium cursor-pointer"
                onClick={() => {
                  navigate("/admin/signin");
                }}>
                login
              </span>
            </div>
            <div>
              <button className="border-green-600 text-green-600 border-2 inline-block rounded-full mt-10 px-6 py-1.5 ml-74px font-semibold hover:bg-green-600 hover:text-white">
                Sign up
              </button>
              {adminSignupError && (
                <div className="text-red-600 font-normal text-sm">
                  {adminSignupError}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
