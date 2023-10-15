import * as yup from 'yup';

const emailRules = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRules = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+-]).{5,}$/;

const signinValidation = yup.object().shape({
    email: yup.string().matches(emailRules, { message: "Enter a valid email" }).required("Email is required"),
    password: yup.string().matches(passwordRules, { message: "Enter a valid password" }).required("Password is required")
})

export default signinValidation;