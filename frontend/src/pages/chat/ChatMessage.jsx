import { useState } from 'react';
import EditProfile from './EditProfile';
import { HiPhone, HiVideoCamera, HiEllipsisHorizontal, HiPaperClip, HiMicrophone } from 'react-icons/hi2';

const messages = [
    { id: 2, sender: false, content: 'มึงว่างานมันเยอะไปปะเทอมนี้', time: '9:20 AM' },
    { id: 3, sender: true, content: 'เออ', time: '9:23 AM' },
    { id: 4, sender: false, content: 'เทอมหน้ากุเรียน algo อีก ชห', time: '9:25 AM' },
    { id: 5, sender: true, content: 'ชิวๆ', time: '9:27 AM' },
];


function MessageItem({ msg }) {
    if (msg.type === 'divider') {
        return <div className="text-center text-gray-500 text-sm my-4">{msg.content}</div>;
    }

    const isSender = msg.sender;

    return (
        <div className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
            <div className="flex items-end max-w-lg">

                <div className={`px-4 py-3 rounded-xl ${isSender ? 'bg-[#FF9A00] text-black rounded-br-none' : 'bg-white text-black shadow-md rounded-bl-none'}`}>
                    <p>{msg.content}</p>
                </div>

                <span className={`text-xs text-gray-400 mx-2 ${isSender ? 'order-first' : ''}`}>
                    {msg.time}
                </span>
            </div>
        </div>
    );
}


function ChatMessage({ selectedRoom, setSelectedRoom, isUploading, setIsUploading, onChangProfile, setOnChangProfile, currentUser, users }) {
    if (!selectedRoom) return;

    const handleChangeProfile = () => {
        if (selectedRoom.isPrivate) return;
        setOnChangProfile(true)
    }
    let displayName = selectedRoom.name;
    let displayImage = selectedRoom.profile ? selectedRoom.profile : "https://i.postimg.cc/XNcYzq3V/user.png";
    let allowEditProfile = !selectedRoom.isPrivate;
    
    if (selectedRoom.isPrivate && currentUser && users) {
      const otherUserId = selectedRoom.member.find(id => id !== currentUser._id);
      
      if (otherUserId) {
        const otherUser = users.find(user => user._id === otherUserId);
        
        if (otherUser) {
          displayName = otherUser.name;
          displayImage = otherUser.profile ? otherUser.profile : "https://i.postimg.cc/XNcYzq3V/user.png";
        }
      }
    }

    return (
        <div className="bg-[#313131] flex flex-col h-auto grow my-8 mr-8 rounded-lg shadow-2xl relative">
             {isUploading && (<div className="bg-black/40 backdrop-blur-[1px] absolute inset-0"></div>)}
            {onChangProfile && (
                <EditProfile
                    setOnChangProfile={setOnChangProfile}
                    type={"room-profile"}
                    profile={selectedRoom.profile}
                    roomId={selectedRoom._id}
                    setSelectedRoom={setSelectedRoom}
                    isUploading={isUploading}
                    setIsUploading={setIsUploading}

                />)}

            <header className="flex items-center justify-between p-4 bg-[#FF9A00] m-4 rounded-lg">
                <div className="flex items-center">
                    <img
                        src={displayImage} 
                        className={`w-15 h-15 rounded-full mr-3 ${allowEditProfile ? 'cursor-pointer' : ''} object-cover bg-white`}
                        onClick={handleChangeProfile}
                    />
                    <div>
                        <h2 className="font-semibold text-white">{displayName}</h2>
                        <p className="text-sm text-white">Online</p>
                    </div>
                </div>

                {/* <div className="flex space-x-4 text-gray-600">
                    <button><HiPhone size={24} /></button>
                    <button><HiVideoCamera size={24} /></button>
                    <button><HiEllipsisHorizontal size={24} /></button>
                </div> */}
            </header>


            <main className="flex-1 p-6 space-y-4 overflow-y-auto bg-[#313131]">
                {messages.map(msg => (
                    <MessageItem key={msg.id} msg={msg} />
                ))}
            </main>

            <footer className="p-4 bg-[#313131] rounded-lg">
                <div className="flex items-center bg-gray-100 rounded-lg p-2">
                    <button className="p-2 text-gray-600 hover:text-blue-500">
                        <HiPaperClip size={24} />
                    </button>
                    <input
                        type="text"
                        placeholder="Enter Your Message"
                        className="flex-1 bg-transparent px-4 py-2 outline-none"
                    />
                    <button className="p-2 text-gray-600 hover:text-blue-500">
                        <HiMicrophone size={24} />
                    </button>
                </div>
            </footer>
        </div>
    );
}

export default ChatMessage;

