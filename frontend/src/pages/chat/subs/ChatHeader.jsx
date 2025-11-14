import { HiUsers } from "react-icons/hi";

export function ChatHeader({ 
    selectedRoom, 
    friendData, 
    handleChangeProfile, 
    isMemberListOpen, 
    setIsMemberListOpen 
}) {
    const mainColor = "[#FF9A00]";

    return (
        <header className={`flex items-center justify-between p-4 m-4 rounded-[20px] bg-${mainColor}`}>
            <div className="flex items-center">
                <img
                    src={selectedRoom.isPrivate ? friendData?.profile : selectedRoom.profile}
                    className="w-15 h-15 rounded-full mr-3 object-cover bg-white cursor-pointer"
                    onClick={handleChangeProfile}
                    alt="Room avatar"
                />
                <div>
                    <h2 className="font-semibold text-white">
                        {selectedRoom.isPrivate ? friendData?.name : selectedRoom.name}
                    </h2>
                    <p className="text-sm text-white">Online</p>
                </div>
            </div>
            {!selectedRoom.isPrivate && (
                <button
                    onClick={() => setIsMemberListOpen(!isMemberListOpen)}
                    className="text-white hover:text-gray-200 text-5xl px-3"
                    title="Show members"
                    aria-label="Toggle member list"
                >
                    <HiUsers />
                </button>
            )}
        </header>
    );
}