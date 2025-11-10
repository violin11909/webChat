import { HiHome, HiChatBubbleLeftRight, HiAdjustmentsHorizontal, HiArrowLeftOnRectangle, } from "react-icons/hi2";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import ImageUploader from '../ImageUploader';


function Sidebar({ setIsUploading, isUploading, isChangingUserProfile, setIsChangingUserProfile }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const activeTabDisplay = (tabName) => {
    return activeTab === tabName ? "bg-[#FF9A00]" : "hover:bg-gray-500";
  };
  if (!user) return;

  return (
    <div className="min-w-30 bg-[#313131] text-white flex flex-col items-center py-6 justify-between mx-6 my-8 rounded-lg">
      <div className="flex flex-col items-center">
        <div className="relative">
          <img
            src={user.profile}
            alt="user-profile"
            className="w-12 h-12 rounded-full mb-8 cursor-pointer z-50 relative"
            onClick={() => setIsChangingUserProfile(true)}
          />

          {isChangingUserProfile && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-0 z-50 w-70 h-100 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-lg"
            >
              {!isUploading && (
                <div
                  onClick={() => setIsChangingUserProfile(false)}
                  className='top-0 right-0 font-bold absolute p-8 text-xl hover:bg-gray-500/40  cursor-pointer rounded-lg w-10 h-10 flex justify-center items-center'>
                  X</div>
              )}
              <ImageUploader
                type="user-profile"
                profile={user.profile}
                // roomId={roomId}
                userId={user._id}
                isUploading={isUploading}
                setIsUploading={setIsUploading}
                setOnChangProfile={setIsChangingUserProfile}
              // setSelectedRoom={setSelectedRoom}
              />

            </div>
          )}

        </div>


        <nav className="flex flex-col space-y-6">
          <button className={`p-3 ${activeTabDisplay("/")} rounded-lg`} onClick={() => navigate("/")}>
            <HiHome size={24} />
          </button>
          <button className={`p-3 ${activeTabDisplay("/chat")} rounded-lg`} onClick={() => navigate("/chat")}>
            <HiChatBubbleLeftRight size={24} />
          </button>
          <button className={`p-3 ${activeTabDisplay("/setting")} rounded-lg`}>
            <HiAdjustmentsHorizontal size={24} />
          </button>
        </nav>

      </div>

      <button className="p-3 rounded-lg hover:bg-gray-500 cursor-pointer" 
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        <HiArrowLeftOnRectangle size={24} />
      </button>

    </div>
  );
}

export default Sidebar;
