import { Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Suggestions() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const userId = user.userId;
  const userName = user.userName;
  const profilePic = user.profilePic;
  return (
    <div className="mt-7 w-300px">
      <div className="flex">
        <span>
          <Avatar
            className=" mr-2 rounded-sm border-solid border-2 border-black border-opacity-20"
            src={profilePic}
            sx={{ width: 60, height: 60 }}
          />
        </span>
        <div className="flex flex-col items-center">
          <span
            className="font-semibold text-lg mt-3 hover:cursor-pointer"
            onClick={() => navigate(`/profile/${userId}`)}>
            {userName}
          </span>{" "}
          {/* <span className="font-light text-13">New to SocioGram</span> */}
        </div>
      </div>

      <div className="font-semibold text-base">Suggestions for you</div>
      <div className="mt-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex">
            <span>
              <Avatar
                className=" mr-2 rounded-sm border-solid border-2 border-black border-opacity-20"
                src="https://i.icanvas.com/list-square/athletes-coaches-1.jpg"
                sx={{ width: 50, height: 50 }}
              />
            </span>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-base hover:cursor-pointer">
                s_a_n_d_e_e_p
              </span>{" "}
              <span className="font-light text-13">New to SocioGram</span>
            </div>
          </div>
          <button className="bg-transparent font-medium text-green-500 text-xs">
            Follow
          </button>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex">
            <span>
              <Avatar
                className=" mr-2 rounded-sm border-solid border-2 border-black border-opacity-20"
                src="https://i.pinimg.com/1200x/92/ce/6a/92ce6af6fc2e41b648b829ad96b8d250.jpg"
                sx={{ width: 50, height: 50 }}
              />
            </span>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-base hover:cursor-pointer">
                s_a_n_d_e_e_p
              </span>{" "}
              <span className="font-light text-13">New to SocioGram</span>
            </div>
          </div>
          <button className="bg-transparent font-medium text-green-500 text-xs">
            Follow
          </button>
        </div>
      </div>
    </div>
  );
}

export default Suggestions;
