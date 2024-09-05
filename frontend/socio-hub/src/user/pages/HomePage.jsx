import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function HomePage() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isLoggedIn = user.success;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/signin");
    }
  }, [isLoggedIn, navigate]);
  const sidebarStyle = {
    width: "20%",
  };
  return (
    <div className="flex">
      <div
        style={sidebarStyle}
        className="border-r">
        <Sidebar />
      </div>
      <div className="w-full ml-32">
        <Feed />
      </div>
    </div>
  );
}

export default HomePage;
