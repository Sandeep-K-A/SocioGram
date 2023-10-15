import Sidebar from "../components/Sidebar";
import AllReports from "../components/AllReports";

const AllReportsPage = () => {
  return (
    <div className="flex">
      <div className="w-1/5">
        <Sidebar />
      </div>
      <div className="w-4/5">
        <AllReports />
      </div>
    </div>
  );
};

export default AllReportsPage;
