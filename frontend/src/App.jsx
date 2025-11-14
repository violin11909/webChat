
import ChatMessage from './pages/chat/ChatMessage';
import ChatList from './pages/chat/ChatList';
import CreateGroupForm from './pages/chat/forms/CreateGroupForm';
import { useState } from 'react';

import { useQueryData } from './contexts/QueryContext';
import { useAuth } from './contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { socket } from './listeners/socketClient';
import { useEffect } from 'react';



function App() {
  const { rooms } = useQueryData();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [onChangProfile, setOnChangProfile] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isMemberListOpen, setIsMemberListOpen] = useState(false);
  const queryClient = useQueryClient();

  const { user: currentUser } = useAuth();
  const { users } = useQueryData();
  const otherUsers = users?.filter(user => user._id !== currentUser?._id);

  useEffect(() => {
    const handleUpdateOnlineUsers = (updatedOnlineUsers) => {
      console.log(updatedOnlineUsers)
      queryClient.setQueryData(['online-users'], (onlineUsers) => {
        return updatedOnlineUsers;
      });
    };

    socket.on('update-online-users', handleUpdateOnlineUsers);

    return () => {
      socket.off('update-online-users', handleUpdateOnlineUsers);
    };
  }, []);

  return (
    <>
      <ChatList
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
        rooms={rooms || []}
        users={otherUsers || []}
        currentUser={currentUser}
        isUploading={isUploading}
        setIsUploading={setIsUploading}
        setOnChangProfile={setOnChangProfile}
        setIsCreatingGroup={setIsCreatingGroup}
        setIsMemberListOpen={setIsMemberListOpen}
      />
      {isCreatingGroup ? (
        <CreateGroupForm
          users={otherUsers}
          currentUser={currentUser}
          setIsCreatingGroup={setIsCreatingGroup}
          setSelectedRoom={setSelectedRoom}
        />
      ) : (
        <ChatMessage
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          isUploading={isUploading}
          setIsUploading={setIsUploading}
          onChangProfile={onChangProfile}
          setOnChangProfile={setOnChangProfile}
          setIsMemberListOpen={setIsMemberListOpen}
          isMemberListOpen={isMemberListOpen}
        />
      )}
    </>
  );
}



export default App;
