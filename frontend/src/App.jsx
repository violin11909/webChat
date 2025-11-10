
import Sidebar from './components/layout/Sidebar';
import ChatMessage from './pages/chat/ChatMessage';
import ChatList from './pages/chat/ChatList';
import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { getRooms } from './service/roomService';



function App() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [onChangProfile, setOnChangProfile] = useState(false);



  const { data: rooms, isLoading: isRoomLoading, isError: isRoomError, } = useQuery({
    queryKey: ['rooms'], queryFn: () => getRooms(), enabled: true, //should be !!user
  });

  return (

    <div className="h-screen w-screen overflow-hidden bg-white flex flex-row">
      <Sidebar />
      <ChatList
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
        rooms={rooms}
        isUploading={isUploading}
        setIsUploading={setIsUploading}
        setOnChangProfile={setOnChangProfile}
      />
      <ChatMessage selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
        isUploading={isUploading}
        setIsUploading={setIsUploading}
        onChangProfile={onChangProfile}
        setOnChangProfile={setOnChangProfile}
      />
    </div>
  );
}



export default App;
