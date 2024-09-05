import { FaUsers } from "react-icons/fa";
// import { IoMdPhotos } from "react-icons/io";
import { MdOutlineReport, MdDashboard } from "react-icons/md";
import { LuSettings2 } from "react-icons/lu";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../utils/store/adminSlice";
import apiInstance from "../../utils/apiInstance";

function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const adminLogout = async () => {
    try {
      await apiInstance.post("/admin/logout");
      dispatch(logout());
      navigate("/admin/signin");
    } catch (error) {
      console.error(`API error${error}`);
    }
  };
  return (
    <div className="fixed flex flex-col justify-between z-1">
      <div
        className="m-6 font-bold text-xl cursor-pointer"
        onClick={() => {
          navigate("/admin");
        }}>
        <span className="text-green-600">Socio</span>Gram <span>Admin</span>
      </div>
      <div className="flex flex-col">
        {/* <button className="flex items-center bg-transparent mx-6 my-2 rounded-md w-full hover:cursor-pointer hover:bg-slate-300 hover:bg-opacity-50">
          <MdDashboard className="h-7 w-7" />
          <span className="font-semibold text-17 leading-28 p-2">
            Dashboard
          </span>
        </button> */}
        <button
          className="flex items-center bg-transparent mx-6 my-2  rounded-md w-full hover:cursor-pointer hover:bg-slate-300 hover:bg-opacity-50"
          onClick={() => {
            navigate("/admin/allusers");
          }}>
          <FaUsers className="h-7 w-7" />
          <span className="font-base text-17 leading-28 p-2">Users</span>
        </button>
        {/* <button className="flex items-center bg-transparent mx-6 my-2  rounded-md w-full hover:cursor-pointer hover:bg-slate-300 hover:bg-opacity-50">
          <IoMdPhotos className="h-7 w-7" />
          <span className="font-base text-17 leading-28 p-2">Posts</span>
        </button> */}
        <button
          className="flex items-center bg-transparent mx-6 my-2  rounded-md w-full hover:cursor-pointer hover:bg-slate-300 hover:bg-opacity-50"
          onClick={() => {
            navigate("/admin/allreports");
          }}>
          <MdOutlineReport className="h-7 w-7" />
          <span className="font-base text-17 leading-28 p-2">Reports</span>
        </button>
      </div>
      <div className="fixed bottom-6">
        <button className="flex items-center bg-transparent mx-6 my-2  rounded-md w-full hover:cursor-pointer hover:bg-slate-300 hover:bg-opacity-50">
          <LuSettings2 className="h-7 w-7" />
          <span className="font-base text-17 leading-28 p-2">Settings</span>
        </button>
        <button
          className="flex items-center bg-transparent mx-6 my-2  rounded-md w-full hover:cursor-pointer hover:bg-slate-300 hover:bg-opacity-50"
          onClick={adminLogout}>
          <CiLogout className="h-7 w-7" />
          <span className="font-base text-17 leading-28 p-2">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
