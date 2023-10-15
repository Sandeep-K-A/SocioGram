import * as yup from "yup";

const passwordRules = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+-]).{5,}$/;
const fullNameRules = /^[A-Za-z\s]{1,20}$/;
const userNameRules = /^[A-Za-z0-9_]{1,20}$/;
const emailRules = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// const phoneRules = /^[1-9][0-9]{0,9}$/;


const signupValidation = yup.object().shape({
    fullName: yup.string().matches(fullNameRules, { message: "Fullname must not contain numbers or special characters" }).required("FullName is required"),
    userName: yup.string().matches(userNameRules, { message: "UserName must not contain any special characters." }).required("UserName is required"),
    email: yup.string().matches(emailRules, { message: "Enter a valid email" }).required("Email is required"),
    // phone: yup.string().matches(phoneRules, { message: "Enter a valid Phone Number" }).required("Phone is required"),
    password: yup.string().matches(passwordRules, { message: "Password must contain at least one Upper-case letter, one digit, and one special character, and be at least 5 characters long." }).required("Password is required")
})

export default signupValidation;