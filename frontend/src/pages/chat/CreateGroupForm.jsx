import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createRoom } from "../../service/roomService";
import { socket } from "../../listeners/socketClient";

function CreateGroupForm({ users, currentUser, setIsCreatingGroup }) {
  const queryClient = useQueryClient();
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  console.log("CreateGroupForm users:", users);
  const handleToggle = (u) => {
    setSelectedUsers((prev) =>
      prev.includes(u._id) ? prev.filter((id) => id !== u._id) : [...prev, u._id]
    );
  };

  const handleSubmit = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) {
      alert("Please enter group name and select members");
      return;
    }
    const roomData = {
      name: groupName,
      isPrivate: false,
      member: [currentUser._id, ...selectedUsers],
    };
    socket.emit("create-room", roomData);

    queryClient.invalidateQueries(["rooms"]);
    setIsCreatingGroup(false);
    socket.emit("join-room", roomData._id);
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#313131] flex flex-col flex-1 rounded-[20px] shadow-2xl p-8 text-white">
      <h2 className="text-2xl font-bold mb-4">Create Group</h2>

      <input
        type="text"
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        className="p-3 rounded-lg text-white mb-4 w-full"
      />

      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-[14px] py-2 px-3 outline-none bg-[#222] text-white mb-4"
      />

      <div className="overflow-y-auto flex-1 space-y-2 bg-[#222] p-4 rounded-lg">
        {filtered.map((u) => (
          <div
            key={u._id}
            className="flex items-center justify-left gap-3 p-2 rounded-lg cursor-pointer"
            onClick={() => handleToggle(u)}
          >
            <div
              className={`w-4 h-4 rounded-full border-2 ${
                selectedUsers.includes(u._id) ? "bg-[#FF9A00]" : "border-white"
              }`}
            ></div>

            <div className="flex items-center gap-3">
              <img src={u.profile} alt="" className="w-10 h-10 rounded-full" />
              <span>{u.name}</span>
            </div>
            
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-4 bg-[#FF9A00] py-3 rounded-lg text-white font-bold hover:bg-orange-500"
      >
        Submit
      </button>
    </div>
  );
}

export default CreateGroupForm;