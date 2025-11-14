
import { socket } from '../../../listeners/socketClient';

export function ChatItem({ room, setSelectedRoom, selectedRoom, setOnChangProfile, setSelectedUser }) {

  const handleSelectRoom = (room) => {
    if (selectedRoom) socket.emit("leave-room", selectedRoom._id);
    socket.emit("join-room", room._id);
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