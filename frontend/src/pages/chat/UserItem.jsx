export function UserItem({ user, onSelectUser, selectedRoom, currentUser }) {
  let isSelected = false;
  if (selectedRoom && selectedRoom.isPrivate && currentUser) {
    isSelected = selectedRoom.member.includes(currentUser._id) && selectedRoom.member.includes(user._id);
  }

  return (
    <div className="flex flex-row items-center" onClick={() => onSelectUser(user)}>
      <img
        src={user.profile ? user.profile : "https://i.postimg.cc/XNcYzq3V/user.png"}
        className="w-15 h-15 rounded-full mr-2 object-cover bg-white" />
      
      <div
        className={`flex grow h-16 items-center p-3 rounded-xl cursor-pointer ${isSelected ? "bg-orange-300" : "bg-white hover:bg-gray-100"} shadow-sm`}>
        <div>
          <h3 className="font-semibold text-black">{user.name}</h3>
        </div>
      </div>
    </div>
  );
}