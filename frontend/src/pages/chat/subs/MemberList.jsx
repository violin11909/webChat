export function MemberList({ 
    members, 
    searchTerm, 
    setSearchTerm, 
    setIsMemberListOpen 
}) {
    return (
        <div className="absolute inset-0 top-[105px] bg-[#222] bg-opacity-95 text-white rounded-[20px] p-4 m-4 z-40 flex flex-col">
            <div className="flex justify-between items-center p-6 border-white/10">
                <h3 className="text-2xl font-bold">Group Members</h3>
                <button
                    onClick={() => setIsMemberListOpen(false)}
                    className="text-white text-2xl hover:text-gray-300"
                    title="Close"
                >
                    ✕
                </button>
            </div>

            <div className="px-6 py-3">
                <input
                    type="text"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-[14px] py-2 px-4 outline-none bg-[#333] text-white placeholder-gray-400"
                />
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 p-6 scrollbar">
                {members.length > 0 ? (
                    members.map((m) => (
                        <div
                            key={m._id}
                            className="flex items-center gap-3 p-3 bg-[#333] rounded-lg hover:bg-[#444] transition"
                        >
                            <img
                                src={m.profile || "https://i.postimg.cc/XNcYzq3V/user.png"}
                                alt={m.name}
                                className="w-12 h-12 rounded-full object-cover bg-white"
                            />
                            <div>
                                <p className="text-lg font-semibold">{m.name}</p>
                                <p className="text-sm text-gray-400">
                                    {m.email || "Member"}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-400 mt-10">
                        No members found
                    </p>
                )}
            </div>

            <div className="p-6">
                <button onClick={() => setIsMemberListOpen(false)} className="w-full bg-[#FF9A00] py-3 rounded-lg text-white font-bold hover:bg-orange-500">
                    Close
                </button>
            </div>
        </div>
    );
}