import Sidebar from "../components/Sidebar";
import AllUsers from "../components/AllUsers";

const AllUsersPage = () => {
  return (
    <div className="flex">
      <div className="w-1/5">
        <Sidebar />
      </div>
      <div className="w-4/5">
        <AllUsers />
      </div>
    </div>
  );
};

export default AllUsersPage;
