import Sidebar from "../components/Sidebar";
import Messenger from "../components/Messenger";
const MessagesPage = () => {
  return (
    <div className="flex">
      <div className="w-1/5">
        <Sidebar />
      </div>
      <div className="w-4/5">
        <Messenger />
      </div>
    </div>
  );
};

export default MessagesPage;
