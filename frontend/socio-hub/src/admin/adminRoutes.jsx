import AdminSignup from "./components/signup";
import AdminSignin from "./components/Signin";
import HomePage from "./pages/HomePage";
import AllUsersPage from "./pages/AllUsersPage";
import BasicModal from "./components/BasicModal";
import AllReportsPage from "./pages/AllReportsPage";
export const adminRoutes = [
  {
    path: "/admin/signup",
    element: <AdminSignup />,
  },
  {
    path: "/admin/signin",
    element: <AdminSignin />,
  },
  {
    path: "/admin",
    element: <HomePage />,
  },
  {
    path: "/admin/allusers",
    element: <AllUsersPage />,
  },
  {
    path: "/admin/modal",
    element: <BasicModal />,
  },
  {
    path: "/admin/allreports",
    element: <AllReportsPage />,
  },
];
