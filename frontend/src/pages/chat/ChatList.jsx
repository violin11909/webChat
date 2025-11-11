import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ChatItem } from "./ChatItem";
import { UserItem } from "./UserItem";
import { useQueryData } from "../../contexts/QueryContext";
import { useAuth } from "../../contexts/AuthContext";

import { socket } from '../../listeners/socketClient';
import { useEffect } from "react";

function ChatList({ selectedRoom, setSelectedRoom, users, currentUser, isUploading, setOnChangProfile }) {
  const [activeTab, setActiveTab] = useState("All");
  const tabs = ["All", "Groups", "Private"]
  const { rooms } = useQueryData();
  const { user } = useAuth();

  const groupRooms = useMemo(() => {
    if (!rooms) return [];
    return rooms.filter((room) => room.isPrivate === false);
  }, [rooms]);

  const privateRooms = useMemo(() => {
    if (!rooms) return [];
    return rooms.filter((room) => room.isPrivate === true);
  }, [rooms]);


  const handleSelectUser = async (clickedUser) => {
    const searchKey = (([user._id, clickedUser._id]).sort()).join("-");
    const existingRoom = privateRooms.find((room) => room.searchKey && room.searchKey === searchKey);

    if (existingRoom) {
      if (selectedRoom) socket.emit("leave-room", selectedRoom._id);
      console.log('beofore join room: ', socket.rooms);
      socket.emit("join-room", existingRoom._id);
      console.log('join room: ', existingRoom._id);

      setSelectedRoom(existingRoom);
      setOnChangProfile(false);
      return;
    } else {
      const roomName = `Private: ${currentUser.name} & ${clickedUser.name}`;
      const roomData = { name: roomName, isPrivate: true, member: [currentUser._id, clickedUser._id] }
      socket.emit("create-room", roomData);

    }
  }

  const queryClient = useQueryClient();

  useEffect(() => {
    const handleNewRoom = (newRoom) => {
      console.log('beofore join room: ', socket.rooms);
      console.log('join room: ', newRoom);
      socket.emit("join-room", newRoom._id);
      setSelectedRoom(newRoom);

      queryClient.setQueryData(['rooms'], (oldRooms) => {
        if (!oldRooms) return [newRoom];
        const isExisting = oldRooms.some(room => room._id === newRoom._id);

        if (isExisting) return oldRooms;
        return [...oldRooms, newRoom];
      });
    };

    socket.on('new-room', handleNewRoom);
    return () => {
      socket.off('new-room', handleNewRoom);
    };

  }, [queryClient, setSelectedRoom]);


  return (
    <div className="min-w-60 bg-[#313131] p-6 overflow-y-auto my-8 mr-6 rounded-lg shadow-lg relative ">
      {isUploading && (<div className="bg-black/40 backdrop-blur-[1px] absolute inset-0"></div>)}

      <div className="flex flex-row items-center font-bold">
        <h2 className="flex-1 text-2xl  text-white ">Chats</h2>
        <div className="text-2xl">+</div>
      </div>

      <div className="flex flex-row gap-2 p-2 px-0">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`w-20 text-white text-center ${activeTab === tab ? "bg-[#FF9A00]" : ""} rounded-sm cursor-pointer`}
            onClick={() => setActiveTab(tab)}>
            {tab}
          </div>
        ))}

      </div>

      {(activeTab === "All" || activeTab === "Groups") && groupRooms.length != 0 && (
        <section>
          <h2 className="flex-1 text-xl font-semibold text-white mb-2">Groups</h2>
          <div className="space-y-6">
            {groupRooms.map((room) => (
              <ChatItem
                key={room._id}
                room={room}
                selectedRoom={selectedRoom}
                setSelectedRoom={setSelectedRoom}
                setOnChangProfile={setOnChangProfile} />
            ))}
          </div>
        </section>
      )}


      {(activeTab === "All" || activeTab === "Private") && (
        <section className="mt-8">
          <h2 className="flex-1 text-xl font-semibold text-white mb-2">Private</h2>
          <div className="space-y-4">
            {users.map((user) => (
              <UserItem
                key={user._id}
                user={user}
                onSelectUser={handleSelectUser}
                selectedRoom={selectedRoom}
                currentUser={currentUser}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
export default ChatList;
