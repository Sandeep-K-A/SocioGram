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
  return (
    <div className="flex">
      <div className="w-1/5">
        <Sidebar />
      </div>
      <div className="w-4/5">
        <Feed />
      </div>
    </div>
  );
}

export default HomePage;
