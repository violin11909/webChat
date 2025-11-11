import { useEffect, useMemo, useState } from "react";

function ChatList({ selectedRoom, setSelectedRoom, rooms, isUploading, setOnChangProfile }) {

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


      {(activeTab === "All" || activeTab === "Private") && privateRooms.length != 0 && (
        <section className="mt-8">
          <h2 className="flex-1 text-xl font-semibold text-white mb-2">Private</h2>
          <div className="space-y-4">
            {privateRooms.map((room) => (
              <ChatItem key={room._id} room={room} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} setOnChangProfile={setOnChangProfile} />
            ))}
          </div>
        </section>

      )}


    </div>
  );
}



function ChatItem({ room, setSelectedRoom, selectedRoom, setOnChangProfile }) {

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setOnChangProfile(false);
  }
  return (
    <div className="flex flex-row items-center" onClick={() => handleSelectRoom(room)}>

      <img
        src={room.profile ? room.profile : "https://i.postimg.cc/XNcYzq3V/user.png"}
        className="w-15 h-15 rounded-full mr-2 object-cover bg-white" />

      <div
        className={`flex grow h-16 items-center p-3 rounded-xl cursor-pointer ${selectedRoom && selectedRoom._id == room._id ? "bg-orange-300" : "bg-white hover:bg-gray-100"} shadow-sm`}>
        <div>
          <h3 className="font-semibold text-black">{room.name}</h3>
          {/* <p className="text-sm text-gray-600">{msg}</p> */}
        </div>

      </div>

    </div>
  );
}
export default ChatList;
