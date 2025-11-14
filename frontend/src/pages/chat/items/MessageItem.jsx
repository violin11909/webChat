export function MessageItem({ content, memberProfile, memberName, user, socket, roomId }) {
    if (!content) return;
    const thiaDate = new Date(content.createdAt).toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
    });
    const isSender = user._id == content.senderId._id
    const emojiList = ["1F602", "1F610", , "1F614", "1F618", "1F620", "1F62D", "1F480"];
    const toEmoji = (e) => {
        const emoji = String.fromCodePoint(parseInt(e, 16));
        return emoji;
    }
    const handleReactEmoji = (emoji) => {
        const data = { reacterId: user._id, messageId: content._id, emoji: emoji, roomId: roomId }
        socket.emit("send-emoji", data)
    }
    return (
        <div className={`group flex flex-row gap-3 ${isSender ? "justify-end" : ""} hover:bg-white/10`}>
            <img src={memberProfile} alt="sender-profile" className={`w-13 h-13 rounded-full object-cover items-center bg-white ${isSender ? "order-last" : ""}`} />
            <div className={`flex max-w-lg flex-col`}>
                <div className={`flex flex-row gap-2 items-end ${isSender ? "justify-end" : ""} relative`}>
                    <span className={`font-bold ${isSender ? "order-last" : ""}`}> {memberName}</span>
                    <span className='text-xs pb-0.5'>{thiaDate}</span>
                    <div className={`max-w-0 overflow-hidden group-hover:max-w-full flex flex-row gap-px items-center ${isSender ? "order-first" : ""}`}>
                        {emojiList.map((e) => (
                            <span key={e} className='cursor-pointer hover:scale-130' onClick={() => handleReactEmoji(e)}>
                                {toEmoji(e)}
                            </span>
                        ))}
                    </div>
                </div>
                <div className={`max-w-180 max-[1500px]:max-w-150 max-[1300px]:max-w-120 max-[1200px]:max-w-90 max-[1100px]:max-w-70 max-[1000px]:max-w-60 max-[900px]:max-w-50 px-4 py-3 rounded-[20px] ${content.type == "image" ? "" : "bg-white shadow-md"} text-black ${isSender ? "rounded-tr-none self-end" : "rounded-tl-none self-start"} relative`}>
                    {content.type == "text" && (<span className='wrap-break-word'>{content.content}</span>)}
                    {content.type == "image" && (<img src={content.content} className='rounded-lg object-cover w-35 h-35' />)}
                </div>
                <div className={`flex flex-row gap-px items-center ${isSender ? "justify-end" : ""}`}>
                    {content.reactEmoji.map((e) => (
                        <span >{toEmoji(e.emoji)}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

