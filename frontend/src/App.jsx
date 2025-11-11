
import Sidebar from './components/layout/Sidebar';
import ChatMessage from './pages/chat/ChatMessage';
import ChatList from './pages/chat/ChatList';
import { useState } from 'react';
import { useQueryData } from './contexts/QueryContext';


function App() {
  const { rooms } = useQueryData();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [onChangProfile, setOnChangProfile] = useState(false);
  const [isChangingUserProfile, setIsChangingUserProfile] = useState(false);

  const handleCloseUserProfile = () => {
    if (!isChangingUserProfile || isUploading) return;
    setIsChangingUserProfile(false)
  }


  return (

    <div className="h-screen w-screen overflow-hidden bg-white flex flex-row z-0" onClick={handleCloseUserProfile}>
      <Sidebar
        isUploading={isUploading}
        setIsUploading={setIsUploading}
        isChangingUserProfile={isChangingUserProfile}
        setIsChangingUserProfile={setIsChangingUserProfile}
      />
      <ChatList
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
        rooms={rooms}
        isUploading={isUploading}
        setIsUploading={setIsUploading}
        setOnChangProfile={setOnChangProfile}
      />
      <ChatMessage
        selectedRoom={selectedRoom}
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
