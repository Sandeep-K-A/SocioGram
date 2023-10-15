import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function HomePage() {
  const navigate = useNavigate();
  const admin = useSelector((state) => state.admin);
  const isLoggedIn = admin.isLoggedIn;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/admin/signin");
    }
  });
  return (
    <div className="flex">
      <div className="w-1/5">
        <Sidebar />
      </div>
      <div className="w-4/5">DashBoard Content</div>
    </div>
  );
}

export default HomePage;
