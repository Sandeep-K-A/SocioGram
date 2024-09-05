import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import apiInstance from "../../utils/apiInstance";
import { useState } from "react";

function HomePage() {
  const navigate = useNavigate();
  const admin = useSelector((state) => state.admin);
  const isLoggedIn = admin.isLoggedIn;
  const [userByMonth, setUserByMonth] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/admin/signin");
    }
  });
  useEffect(() => {
    fetchUserMonthlyCount();
  }, []);

  const fetchUserMonthlyCount = async () => {
    try {
      const usersCountByMonth = await apiInstance.get(
        "/admin/user-count-month"
      );
      setUserByMonth(usersCountByMonth);
    } catch (error) {
      console.error(`API error${error}`);
    }
  };
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
