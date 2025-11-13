import { HiHome, HiChatBubbleLeftRight, HiAdjustmentsHorizontal, HiArrowLeftOnRectangle, } from "react-icons/hi2";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useUI } from "../../contexts/UIContext";

function Sidebar() {
  const { user, logout } = useAuth();
  const { isEditingProfile, setIsEditingProfile } = useUI();
  const location = useLocation();
  const navigate = useNavigate();
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const getTabClass = (path) => {
    if (path === '/setting' && isEditingProfile) {
      return "bg-[#FF9A00]";
    }
    if (path !== '/setting' && activePath === path && !isEditingProfile) {
      return "bg-[#FF9A00]";
    }
    return "hover:bg-gray-500";
  };

  if (!user) return;

  return (
    <div className="min-w-30 bg-[#313131] text-white flex flex-col items-center py-6 justify-between rounded-[20px]">
      <div className="flex flex-col items-center ">
        <div className="relative h-12">
          <img
            src={user.profile}
            alt="user-profile"
            className="w-12 h-12 rounded-full mb-8 cursor-pointer z-50 relative bg-white"
            onClick={() => setIsEditingProfile(true)}
          />
        </div>
        <span className="max-w-26 wrap-break-word text-center mt-3">{user.name}</span>

        <nav className="flex flex-col space-y-6 mt-6">
          <button className={`p-3 ${getTabClass("/")} rounded-lg`} onClick={() => { navigate("/"); setIsEditingProfile(false); }}>
            <HiHome size={24} />
          </button>
          <button className={`p-3 ${getTabClass("/chat")} rounded-lg`} onClick={() => { navigate("/chat"); setIsEditingProfile(false); }}>
            <HiChatBubbleLeftRight size={24} />
          </button>
          <button className={`p-3 ${getTabClass("/setting")} rounded-lg`} onClick={() => setIsEditingProfile(prev => !prev)}>
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
