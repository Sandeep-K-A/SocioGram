import Signup from "./components/Signup";
import Signin from "./components/Signin";
import HomePage from "./pages/HomePage";
import EmailVerification from "./components/EmailVerification";
import ProfilePage from "./pages/ProfilePage";
import ForgotPassword from "./components/ForgotPassword";
import MessagesPage from "./pages/MessagesPage";

export const userRoutes = [
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/signin",
    element: <Signin />,
  },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/profile/:userId",
    element: <ProfilePage />,
  },
  {
    path: "/users/:user_id/verify/:verifyToken",
    element: <EmailVerification />,
  },
  {
    path: "/users/:user_id/forgot-password/:verifyToken",
    element: <ForgotPassword />,
  },
  {
    path: "/messenger",
    element: <MessagesPage />,
  },
];
