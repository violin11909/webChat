import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRoom } from '../../service/roomService'; 
import { ChatItem } from "./ChatItem";
import { UserItem } from "./UserItem";

function ChatList({ selectedRoom, setSelectedRoom, rooms, users, currentUser, isUploading, setOnChangProfile }) {

  const [activeTab, setActiveTab] = useState("All");

  const getTypeRooms = (isPrivate) => {
    if (!rooms) return [];
    return rooms.filter((room) => room.isPrivate == isPrivate);
  }

  const tabs = ["All", "Groups", "Private"]

  const groupRooms = useMemo(() => {
    if (!rooms) return [];
    return rooms.filter((room) => room.isPrivate === false);
  }, [rooms]);

  const privateRooms = useMemo(() => {
    if (!rooms) return [];
    return rooms.filter((room) => room.isPrivate === true);
  }, [rooms]);

  const queryClient = useQueryClient();
  const createRoomMutation = useMutation({
    mutationFn: ({ name, isPrivate, member }) => createRoom(name, isPrivate, member),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      setSelectedRoom(data);
    },
    onError: (error) => {
      console.error("Error creating room:", error);
    } 
  });

  const handleSelectUser = (clickedUser) => {
    //check if private room between current user and clicked user already exists
    const existingRoom = privateRooms.find((room) => {
      // didnot check other logic because private room handle isPrivate equals true already
      return room.member.includes(currentUser._id) && room.member.includes(clickedUser._id);
    });
    if (existingRoom) {
      setSelectedRoom(existingRoom);
      setOnChangProfile(false);
      return;
    } else {
      //create new private room
      const roomName = `Private Chat: ${currentUser.name} & ${clickedUser.name}`;
      createRoomMutation.mutate({
        name: roomName,
        isPrivate: true,
        member: [currentUser._id, clickedUser._id]
      });
    }
  }

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
            key={tab}
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
