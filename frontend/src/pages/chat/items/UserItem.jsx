
export function UserItem({ user, onSelectUser, isOnline, isSelected }) {

  return (
    <div className="flex flex-row items-center relative" onClick={() => onSelectUser(user)}>
      <div className={`top-0 left-0 absolute w-2 h-2 rounded-full  ${isOnline ? "bg-green-500" : "bg-red-500"}`}></div>
      <img
        src={user.profile || "https://i.postimg.cc/XNcYzq3V/user.png"}
        className="w-15 h-15 rounded-full mr-2 object-cover bg-white"
      />
      <div
        className={`flex grow h-16 items-center p-3 rounded-xl cursor-pointer shadow-sm transition-all duration-150 ${isSelected ? "bg-orange-300 text-white" : "bg-white hover:bg-gray-100"
          }`}
      >
        <div>
          <h3 className="font-semibold text-black">{user.name}</h3>
        </div>
      </div>
    </div>
  );
}
