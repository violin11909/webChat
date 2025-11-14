export function NotMember({handleJoinRoom}) {
    return (
        <div className="flex-1 flex flex-col justify-center items-center text-center p-4">
            <h3 className="text-xl mb-2 text-white">You are not a member of this group.</h3>
            <p className="text-gray-400">Join to see the conversation and send messages.</p>
            <button className="w-full max-w-md mt-6 bg-orange-400 hover:bg-orange-300 text-white font-bold py-4 px-4 rounded-3xl text-xl" onClick={handleJoinRoom}>
                Join Group
            </button>
        </div>
    )
}