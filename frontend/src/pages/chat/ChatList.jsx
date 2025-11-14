import { useMemo, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ChatItem } from "./items/ChatItem";
import { UserItem } from "./items/UserItem";
import { useQueryData } from "../../contexts/QueryContext";
import { useAuth } from "../../contexts/AuthContext";

import { socket } from '../../listeners/socketClient';
import { useEffect } from "react";

function ChatList({ selectedRoom, setSelectedRoom, users, currentUser, isUploading, setOnChangProfile, setIsCreatingGroup, isMemberListOpen, setIsMemberListOpen }) {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(""); 
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

  // Handle user selection for private chat
  const handleSelectUser = useCallback(async (clickedUser) => {
    setSelectedUser(clickedUser);
    setSelectedRoom(null);
    setIsCreatingGroup(false);
    setIsMemberListOpen(false);

    const searchKey = [user._id, clickedUser._id].sort().join("-");
    
    // This one-time listener will handle opening the room for the user who clicked.
    socket.once("new-room", (newRoom) => {
      // Ensure we're acting on the correct room creation event
      if (newRoom.searchKey === searchKey) {
        if (selectedRoom) socket.emit("leave-room", selectedRoom._id);
        socket.emit("join-room", newRoom._id);
        setSelectedRoom(newRoom);
        setOnChangProfile(false);
      }
    });

    // Emit create-room. The backend will find or create the room and emit "new-room"
    const roomName = `Private: ${currentUser.name} & ${clickedUser.name}`;
    const roomData = { name: roomName, isPrivate: true, member: [currentUser._id, clickedUser._id] };
    socket.emit("create-room", roomData);

  }, [user, selectedRoom, setSelectedRoom, setOnChangProfile, setIsCreatingGroup, setIsMemberListOpen, currentUser]);

  const queryClient = useQueryClient();

  useEffect(() => {
    const handleNewRoom = (newRoom) => {
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

  }, [queryClient]);

  const filteredGroupRooms = groupRooms.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-w-60 bg-[#313131] rounded-[20px] shadow-lg relative flex flex-col">
      {isUploading && (<div className="bg-black/40 backdrop-blur-[1px] absolute inset-0"></div>)}

      <div className="flex flex-row items-center font-bold p-6">
        <h2 className="flex-1 text-2xl  text-white ">Chats</h2>
        <div className="text-2xl cursor-pointer hover:text-orange-300" onClick={() => setIsCreatingGroup(true)}>+</div>
      </div>

      <div className="flex flex-row gap-2 p-2 px-4">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`w-20 text-white text-center ${activeTab === tab ? "bg-[#FF9A00]" : ""} rounded-[14px] cursor-pointer`}
            onClick={() => setActiveTab(tab)}>
            {tab}
          </div>
        ))}
      </div>

      <div className="p-3 px-4">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-[14px] py-2 px-3 outline-none bg-[#222] text-white"
        />
      </div>

      <div className="overflow-y-auto flex-1 pl-4 my-2 mx-2 scrollbar ">

        {(activeTab === "All" || activeTab === "Groups") && groupRooms.length != 0 && (
          <section className="mb-6">
            <h2 className="flex-1 text-xl font-semibold text-white">Groups</h2>
            <div className="space-y-4">
              {filteredGroupRooms.map((room) => (
                <ChatItem
                  key={room._id}
                  room={room}
                  selectedRoom={selectedRoom}
                  setSelectedRoom={(room) => {
                    setSelectedRoom(room);
                    setSelectedUser(null);
                    setIsCreatingGroup(false);
                    setIsMemberListOpen(false);
                  }}
                  setOnChangProfile={setOnChangProfile}
                />
              ))}
            </div>
          </section>
        )}


        {(activeTab === "All" || activeTab === "Private") && (
          <section>
            <h2 className="flex-1 text-xl font-semibold text-white mb-2">Private</h2>
            <div className="space-y-4">
              {filteredUsers.map((u) => (
                <UserItem
                  key={u._id}
                  user={u}
                  onSelectUser={handleSelectUser}
                  isSelected={selectedUser?._id === u._id}
                  currentUser={currentUser}
                />
              ))}
            </div>
          </section>
        )}

      </div>

    </div>
  );
}
export default ChatList;
