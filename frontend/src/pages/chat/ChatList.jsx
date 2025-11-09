import { useState } from "react";

const groups = [
  { name: "Group A", msg: "มีเเต่งาน", img: "https://picsum.photos/id/237/200/300", active: true },
  { name: "Group B", msg: "เเล้วก็งาน", img: "https://picsum.photos/id/238/200/300", active: false },
  { name: "Group C", msg: "เหนื่อยชหเทอมนี้", img: "https://picsum.photos/id/239/200/300", active: false },
];

const personal = [{ name: "Bas", msg: "Zzzz", img: "https://picsum.photos/id/240/200/300", active: false }];

function ChatList() {
  const [activeTab, setActiveTab] = useState("All");
  const selectRoomStyle = (tabName) => {
    return `flex-1 flex items-center justify-center ${activeTab === tabName ? "bg-[#FF9A00] text-black" : ""} p-1 rounded-md  font-[600] select-none`;
  };
  return (
    <div className="min-w-60 bg-[#313131] p-6 overflow-y-auto my-8 mr-6 rounded-lg shadow-lg">
      <div className="flex flex-row items-center">
        <h2 className="flex-1 text-2xl font-[900] text-white ">Chats</h2>
        <div className="text-2xl font-[900]">+</div>
      </div>
      <div className="flex flex-row mr-24 gap-2 m-2">
        <div className={selectRoomStyle("All")} onClick={() => setActiveTab("All")}>
          All
        </div>
        <div className={selectRoomStyle("Groups")} onClick={() => setActiveTab("Groups")}>
          Groups
        </div>
        <div className={selectRoomStyle("Private")} onClick={() => setActiveTab("Private")}>
          Private
        </div>
      </div>
      <section>
        <h2 className="flex-1 text-xl font-[600] text-white mb-2">Groups</h2>

        <div className="space-y-6">
          {groups.map((group) => (
            <ChatItem key={group.name} {...group} />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="flex-1 text-xl font-[600] text-white mb-2">Private</h2>
        <div className="space-y-4">
          {personal.map((person) => (
            <ChatItem key={person.name} {...person} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ChatItem({ name, msg, img, active }) {
  return (
    <div className="flex flex-row items-center">
      <img src={img} alt={name} className="w-18 h-18 rounded-full mr-2" />
      <div className={`flex flex-grow h-16 items-center p-3 rounded-xl cursor-pointer ${active ? "bg-orange-300" : "bg-white hover:bg-gray-100"} shadow-sm`}>
        <div>
          <h3 className="font-semibold text-black">{name}</h3>
          {/* <p className="text-sm text-gray-600">{msg}</p> */}
        </div>
      </div>
    </div>
  );
}
export default ChatList;
