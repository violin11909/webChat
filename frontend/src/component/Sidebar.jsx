
import {
  HiHome, HiChatBubbleLeftRight, HiAdjustmentsHorizontal, HiArrowLeftOnRectangle,
  HiPhone, HiVideoCamera, HiEllipsisHorizontal, HiPaperClip, HiMicrophone
} from 'react-icons/hi2';

function Sidebar() {
  return (

    <div className="min-w-30 bg-blue-900 text-white flex flex-col items-center py-6 justify-between">

      <div className="flex flex-col items-center">
        <img src="https://placeimg.com/100/100/people/5" alt="Profile" className="w-12 h-12 rounded-full mb-8" />
        <nav className="flex flex-col space-y-6">
          <button className="p-3 rounded-lg hover:bg-blue-700">
            <HiHome size={24} />
          </button>
          <button className="p-3 bg-white/20 rounded-lg"> 
            <HiChatBubbleLeftRight size={24} />
          </button>
          <button className="p-3 rounded-lg hover:bg-blue-700">
            <HiAdjustmentsHorizontal size={24} />
          </button>
        </nav>
      </div>

      <button className="p-3 rounded-lg hover:bg-blue-700 cursor-pointer">
        <HiArrowLeftOnRectangle size={24} />
      </button>
    </div>
  );
}

export default Sidebar;