import { Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import apiInstance from "../../utils/apiInstance";
import { Modal, Box } from "@mui/material";
const AllReports = () => {
  const [allReports, setAllReports] = useState([]);
  const admin = useSelector((state) => state.admin);
  const [inspectModal, setInspectModal] = useState(false);
  const [inspectPost, setInspectPost] = useState({});
  const handleInspectModalOpen = () => {
    setInspectModal(true);
  };
  const handleInspectModalClose = () => {
    setInspectModal(false);
  };
  let token = admin.token;
  const headers = {
    authorization: token,
  };
  const fetchReports = async () => {
    try {
      const response = await apiInstance.get(`/admin/allreports`, { headers });
      const { success, reports } = response.data;
      if (success) {
        setAllReports(reports);
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };
  const handleResolve = async (reportId, postId) => {
    try {
      const response = await apiInstance.get(
        `/admin/resolve-report/${reportId}/${postId}`,
        { headers }
      );
      const { success, resolvedReport } = response.data;
      if (success) {
        const updatedReports = [...allReports];
        const index = updatedReports.findIndex(
          (report) => report._id == resolvedReport._id
        );
        updatedReports.splice(index, 1);
        setAllReports(updatedReports);
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };
  const handleDelete = async (reportId) => {
    try {
      const response = await apiInstance.get(
        `/admin/delete-report/${reportId}`,
        { headers }
      );
      const { success, deletedReport } = response.data;
      if (success) {
        const updatedReports = [...allReports];
        const index = updatedReports.findIndex(
          (report) => report._id == deletedReport._id
        );
        updatedReports.splice(index, 1);
        setAllReports(updatedReports);
      }
    } catch (error) {
      console.error(`API Error ${error}`);
    }
  };
  useEffect(() => {
    fetchReports();
  }, []);
  console.log(headers);
  return (
    <div className="flex flex-col">
      <div className="font-semibold text-4xl mt-5 mb-8">Manage Reports</div>
      {allReports?.length == 0 ? (
        <div className="text-lg font-medium">No Reports to Display</div>
      ) : (
        <div className="rounded-2xl w-1200px bg-white">
          <table className="item-center w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-base border-b-solid tracking-none whitespace-nowrap text-blue-500 opacity-70">
                  No.
                </th>
                <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-blue-500 opacity-70">
                  ReportedBy
                </th>
                <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-blue-500 opacity-70">
                  ReportedPost
                </th>
                <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-blue-500 opacity-70">
                  Reason
                </th>
                <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-blue-500 opacity-70">
                  Actions
                </th>
                {/* <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-blue-500 opacity-70">
                UserStatus
              </th>
              <th className="pr-6 pl-16 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-blue-500 opacity-70">
                Actions
              </th> */}
              </tr>
            </thead>
            <tbody>
              {allReports &&
                allReports?.map((report, index) => (
                  <tr key={report?._id}>
                    <td className="px-6 py-3 font-medium">{index + 1}</td>
                    <td className="">
                      <div className="flex items-center">
                        <Avatar
                          src={report?.reportedBy?.profilePic}
                          className="mt-2 mb-2 mr-4"
                        />
                        <span className="font-medium">
                          {report?.reportedBy?.userName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3 font-medium">
                      <img
                        className="w-10 h-10"
                        src={report?.reportedPost?.postImage}
                        alt=""
                      />
                    </td>
                    <td className="px-6 py-3 font-medium">
                      <span className="text-red-600 font-semibold ">
                        {report?.reason}
                      </span>
                    </td>
                    <td className="pr-6">
                      <div className="flex items-center mr-6">
                        <button
                          className="rounded-full h-8 bg-blue-600 cursor-pointer mr-1"
                          onClick={() => {
                            handleInspectModalOpen();
                            setInspectPost(report?.reportedPost);
                          }}>
                          <span className="m-5 text-white text-sm font-medium">
                            view
                          </span>
                        </button>
                        <button
                          className="rounded-full h-8 w-24 bg-green-600 cursor-pointer mr-1"
                          onClick={() => {
                            handleResolve(
                              report?._id,
                              report?.reportedPost._id
                            );
                          }}>
                          <span className="m-5 text-white text-sm font-medium">
                            Resolve
                          </span>
                        </button>
                        <button
                          className="rounded-full h-8 bg-red-600 cursor-pointer"
                          onClick={() => {
                            handleDelete(report?._id);
                          }}>
                          <span className="m-5 text-white text-sm font-medium">
                            Delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      {inspectModal && (
        <div>
          <Modal
            open={inspectModal}
            onClose={handleInspectModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box
              sx={{ width: "40%", height: "60%" }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-400 bg-slate-950 shadow-xl rounded-2xl">
              <div className="flex">
                <div>
                  {" "}
                  <img
                    className="w-48 h-full m-10"
                    src={inspectPost?.postImage}
                    alt=""
                  />
                </div>
                <div className="flex flex-col justify-between items-center mt-10">
                  <div className="flex">
                    <span className="text-white">PostId :</span>
                    <span className="text-blue-600 font-semibold text-xl ml-5">
                      {inspectPost?.postId}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-white">UserName :</span>
                    <span className="text-blue-600 font-semibold text-xl ml-5">
                      {inspectPost?.userId?.userName}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-white">TotalLikes :</span>
                    <span className="text-blue-600 font-semibold text-xl ml-5">
                      {inspectPost?.likes?.length}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-white">TotalComments :</span>
                    <span className="text-blue-600 font-semibold text-xl ml-5">
                      {inspectPost?.commentsCount}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-white">Description :</span>
                    <span className="text-blue-600 font-semibold text-xl ml-5">
                      {inspectPost?.postDescription}
                    </span>
                  </div>
                </div>
              </div>
            </Box>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default AllReports;
