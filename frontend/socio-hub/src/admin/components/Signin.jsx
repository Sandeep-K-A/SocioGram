import { FaRegEnvelope } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import apiInstance from "../../utils/apiInstance";
import signinValidation from "../../utils/validationSchema/signinValidation";
import { useFormik } from "formik";
import { login } from "../../utils/store/adminSlice";
import * as yup from "yup";

function Signin() {
  const [adminSigninError, setAdminSigninError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const admin = useSelector((state) => state.admin);
  const isLoggedIn = admin.isLoggedIn;

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/admin");
    }
  }, [isLoggedIn, navigate]);

  const onSubmit = async (values) => {
    try {
      const response = await apiInstance.post("/admin/signin", values);
      const { admin, success, message, token } = response.data;
      if (success) {
        dispatch(login({ admin, success, token }));
        navigate("/admin");
      } else {
        setAdminSigninError(message);
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };

  const { values, handleBlur, handleChange, handleSubmit, touched, errors } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: yup.object().shape({
        email: signinValidation.fields.email,
        password: signinValidation.fields.password,
      }),
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
            Log into your Account
          </h2>
          <form
            onSubmit={handleSubmit}
            className="mt-3 mb-8">
            <div className="bg-gray-200 w-64 p-2 flex items-center mb-3 rounded-full">
              <FaRegEnvelope className="text-gray-400 m-2" />
              <input
                className="bg-gray-200 outline-none text-sm flex-1 "
                autoComplete="off"
                type="text"
                name="email"
                placeholder="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
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
                type="password"
                name="password"
                placeholder="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
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
              <span className="mr-2">create new account ?</span>
              <span
                className="text-blue-600 font-medium cursor-pointer"
                onClick={() => {
                  navigate("/admin/signup");
                }}>
                signup
              </span>
            </div>
            <div>
              <button
                type="submit"
                className="border-green-600 text-green-600 border-2 inline-block rounded-full mt-10 px-6 py-1.5 ml-74px font-semibold hover:bg-green-600 hover:text-white">
                Sign in
              </button>
            </div>
          </form>
          {adminSigninError && (
            <div className="text-red-600 font-normal text-sm">
              {adminSigninError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Signin;
