import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { socket } from "../../listeners/socketClient";
import { useAuth } from "../../contexts/AuthContext";

function CreateGroupForm({ setIsCreatingGroup, setSelectedRoom }) {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const [groupName, setGroupName] = useState("");

  const handleSubmit = async () => {
    if (!groupName.trim()) {
      alert("Please enter a group name.");
      return;
    }
    // join after create
    socket.once("new-room", (newRoom) => {
      if (!newRoom.isPrivate) {
        socket.emit("join-room", newRoom._id);
        setSelectedRoom(newRoom);
      }
    });

    const roomData = {
      name: groupName,
      isPrivate: false,
      member: [currentUser._id], // Create group with only the current user
    };
    socket.emit("create-room", roomData);

    queryClient.invalidateQueries(["rooms"]);
    setIsCreatingGroup(false);
  };

  return (
    <div className="bg-[#313131] flex flex-col flex-1 rounded-[20px] shadow-2xl p-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Create New Group</h2>
        <button 
            className="text-2xl cursor-pointer hover:text-orange-300" 
            onClick={() => setIsCreatingGroup(false)}
        >
            &times;
        </button>
      </div>

      <div className="space-y-4">
        <div>
            <label htmlFor="groupName" className="block text-sm font-medium mb-1">Group Name</label>
            <input
                id="groupName"
                type="text"
                placeholder="Enter group name..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="p-3 rounded-lg bg-[#222] text-white w-full outline-none"
            />
        </div>
      </div>

      <div className="mt-auto">
        <button
            onClick={handleSubmit}
            className="w-full mt-4 bg-[#FF9A00] py-3 rounded-lg text-white font-bold hover:bg-orange-500 disabled:bg-gray-500"
            disabled={!groupName.trim()}
        >
            Create Group
        </button>
      </div>
    </div>
  );
}

export default CreateGroupForm;