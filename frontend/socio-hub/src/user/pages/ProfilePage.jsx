import Sidebar from "../components/Sidebar";
import Profile from "../components/Profile";
const ProfilePage = () => {
  return (
    <div className="flex">
      <div className="w-1/5">
        <Sidebar />
      </div>
      <div className="w-4/5">
        <Profile />
      </div>
    </div>
  );
};

export default ProfilePage;
