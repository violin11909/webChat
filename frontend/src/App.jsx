
import Sidebar from './components/layout/Sidebar';
import ChatMessage from './pages/chat/ChatMessage';
import ChatList from './pages/chat/ChatList';
import { useState } from 'react';

import { useQueryData } from './contexts/QueryContext';
import { useQuery } from "@tanstack/react-query";
import { getRooms } from './service/roomService';
import { getUsers } from './service/userService';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { rooms } = useQueryData();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [onChangProfile, setOnChangProfile] = useState(false);
  const [isChangingUserProfile, setIsChangingUserProfile] = useState(false);


  const { user: currentUser } = useAuth();

  const { data: users, isLoading: isAllUsersLoading } = useQuery({
    queryKey: ['users'], queryFn: () => getUsers(), enabled: !!currentUser,
  });

  const otherUsers = users?.filter(user => user._id !== currentUser?._id);

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
        rooms={rooms || []}  
        users={otherUsers || []} 
        currentUser={currentUser} 
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
        currentUser={currentUser}
        users={otherUsers || []} 
      />
    </div>
  );
}



export default App;
