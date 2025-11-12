import EditProfile from './EditProfile';
import { HiPaperClip, HiMicrophone } from 'react-icons/hi2';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getContentsByRoomId, joinRoom } from '../../service/roomService';
import { sendContent } from '../../listeners/userEvent';
import { useSaveContent } from '../../hooks/useSaveContent';
import { useAuth } from '../../contexts/AuthContext';
import { useMemo, useState } from 'react';
import { useRef } from 'react';
import { useLayoutEffect } from 'react';    
import { HiUsers } from "react-icons/hi";

import { socket } from '../../listeners/socketClient';
import { useEffect } from 'react';
import ImageUploader from '../../components/ImageUploader';
import Microphone from './Microphone';

function ChatMessage({ selectedRoom, setSelectedRoom, isUploading, setIsUploading, onChangProfile, setOnChangProfile, isMemberListOpen, setIsMemberListOpen }) {
    if (!selectedRoom) return;
    const { user } = useAuth();
    const mainColor = "[#FF9A00]";

    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isSendingImage, setIsSendingImage] = useState(false); //uploading
    const [urlFirebase, setUrlFirebase] = useState("");
    const [isSendingImageSuccess, setIsSendingImageSuccess] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredMembers = useMemo(() => {
        if (!selectedRoom || !selectedRoom.member) return [];
        return selectedRoom.member.filter((m) =>
            m.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [selectedRoom, searchTerm]);


    useEffect(() => {
        if (!selectedImage) return;

        const objectUrl = URL.createObjectURL(selectedImage);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedImage]);



    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const maxSize = 2 * 1024 * 1024; // 2MB

            if (file.size > maxSize) {
                alert("ขนาดไฟล์เกิน 2MB!");
                e.target.value = "";
                return;
            }
            setSelectedImage(file);
            console.log(file)
        }
    };

    const friendData = useMemo(() => {
        if (selectedRoom.isPrivate && selectedRoom.member && user) {

            const friend = selectedRoom.member.find((u) => u._id !== user._id);
            return friend ? friend : null;
        }
        return null;
    }, [selectedRoom, user]);

    const { data: contents, isLoading, isError } =
        useQuery({
            queryKey: ['contents', selectedRoom._id],
            queryFn: () => getContentsByRoomId(selectedRoom._id),
            enabled: !!selectedRoom._id,
        });

    const queryClient = useQueryClient();
    useEffect(() => {
        if (!selectedRoom || !selectedRoom._id) return;

        const handleRecieveMessage = (msg) => {

            queryClient.setQueryData(['contents', selectedRoom._id], (oldContents) => {
                if (!oldContents) return [msg];

                const isExisting = oldContents.some(content => content._id === msg._id);
                if (isExisting) return oldContents;
                return [...oldContents, msg];
            });
        };
        const handleRecieveEmoji = (msg) => {
            console.log('receive emoji ', msg)
            queryClient.setQueryData(['contents', selectedRoom._id], (oldContents) => {

                if (!oldContents || !Array.isArray(oldContents)) {
                    return [msg];
                }

                return oldContents.map(content => {
                    if (content._id === msg._id) return msg;

                    return content;
                });
            });
        };
        socket.on('receive-message', handleRecieveMessage);
        socket.on('receive-emoji', handleRecieveEmoji);

        return () => {
            socket.off('receive-message', handleRecieveMessage);
            socket.off('receive-emoji', handleRecieveEmoji);
        };

    }, [queryClient, selectedRoom._id]);


    const mapMemberProfile = useMemo(() => {
        if (!selectedRoom || !selectedRoom.member) return {};

        return selectedRoom.member.reduce((acc, m) => {
            acc[m._id] = [m.profile, m.name];
            return acc;
        }, {});
    }, [selectedRoom]);



    const [message, setMessage] = useState("")
    const [isMember, setIsMember] = useState(null)

    useEffect(() => {
        setIsMember(selectedRoom.isPrivate ? true : mapMemberProfile[user._id] ? true : false)
    }, [])

    const handleChangeProfile = () => {
        if (selectedRoom.isPrivate) return;
        setOnChangProfile(true)
    }

    const sendUserContent = (roomId, content, type) => {
        const messageData = { roomId: roomId, content: content, type: type, senderId: user._id, createdAt: new Date() }
        if (type == 'text' || type == "image") socket.emit("send-message", messageData);
        else alert('Unknown message')
        setMessage("")
    }

    useEffect(() => {
        if (!isSendingImageSuccess) return;
        setIsSendingImageSuccess(false);
        sendUserContent(selectedRoom._id, urlFirebase, "image")
    }, [isSendingImageSuccess]);

    const handleJoinRoom = async () => {
        const res = await joinRoom(selectedRoom._id, user._id);
        if (res) {
            setSelectedRoom(res);
            setIsMember(true)
            socket.emit("join-room", res._id);
            return;
        }
        setIsMember(false)
    }

    const messagesEndRef = useRef(null); //scroller ล่างสุด
    useLayoutEffect(() => {
        if (messagesEndRef.current) {
            const container = messagesEndRef.current;
            container.scrollTop = container.scrollHeight;
        }
    }, [contents?.length]);

    if (!contents) return;


    return (
        <div className="bg-[#313131] flex flex-col flex-1 rounded-[20px] shadow-2xl relative">
            {isUploading && (<div className="bg-black/40 backdrop-blur-[1px] absolute inset-0"></div>)}
            {!isMember && (<div className="bg-[#313131]  absolute inset-0 flex flex-col justify-center items-center rounded-[20px] gap-5">
                <div>Do you want to join  <span className={`font-bold text-xl text-${mainColor}`}>"{selectedRoom.name}"</span> room</div>
                <div className='flex flex-row gap-5 w-full justify-center'>
                    <button className={`bg-green-400 p-3 w-30 cursor-pointer`} onClick={handleJoinRoom}>Join</button>
                </div>

            </div>)}

            {onChangProfile && (
                <EditProfile
                    setOnChangProfile={setOnChangProfile}
                    type={"room-profile"}
                    profile={selectedRoom.profile}
                    roomId={selectedRoom._id}
                    setSelectedRoom={setSelectedRoom}
                    isUploading={isUploading}
                    setIsUploading={setIsUploading}

                />)}

            <header className={`flex items-center justify-between p-4 m-4 rounded-[20px] bg-${mainColor}`}>
                <div className="flex items-center">
                    <img
                        src={selectedRoom.isPrivate ? friendData.profile : selectedRoom.profile}
                        className={`w-15 h-15 rounded-full mr-3  object-cover bg-white`}
                        onClick={handleChangeProfile}
                    />
                    <div>
                        <h2 className="font-semibold text-white">{selectedRoom.isPrivate ? friendData.name : selectedRoom.name}</h2>
                        <p className="text-sm text-white">Online</p>
                    </div>
                </div>
                {!selectedRoom.isPrivate && (
                    <button
                    onClick={() => setIsMemberListOpen(!isMemberListOpen)}
                    className="text-white hover:text-gray-200 text-2xl"
                    title="Show members"
                    >
                    <HiUsers />
                    </button>
                )}
            </header>

            {isMemberListOpen && (
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

                {/* Search bar */}
                <div className="px-6 py-3">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-[14px] py-2 px-4 outline-none bg-[#333] text-white placeholder-gray-400"
                />
                </div>

                {/* Member list */}
                <div className="flex-1 overflow-y-auto space-y-3 p-6 scrollbar">
                {filteredMembers.length > 0 ? (
                    filteredMembers.map((m) => (
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
                        <p className="text-sm text-gray-400">{m.email || "Member"}</p>
                        </div>
                    </div>
                    ))
                ) : (
                    <p className="text-center text-gray-400 mt-10">No members found</p>
                )}
                </div>

                <div className="p-6">
                <button
                    onClick={() => setIsMemberListOpen(false)}
                    className="w-full bg-[#FF9A00] py-3 rounded-lg text-white font-bold hover:bg-orange-500"
                >
                    Close
                </button>
                </div>
            </div>
            )}

            {!isMemberListOpen && (
            <main className="p-6 space-y-4 overflow-y-auto h-full" ref={messagesEndRef}>
                {contents.map(content => {
                    return (
                        <MessageItem
                            key={content._id}
                            content={content}
                            memberProfile={content.senderId.profile}
                            memberName={content.senderId.name}
                            user={user}
                            socket={socket}
                            roomId={selectedRoom._id}
                        />
                    );
                })}
            </main>
            )}
            
            {!isMemberListOpen && (
            <section className="p-4 bg-[#313131] text-black rounded-[20px]">
                <div className={`flex items-center  justify-between text-white gap-x-5 relative`}>

                    <div className={`flex-1 outline-none rounded-[20px] flex flex-row gap-3 z-10 relative`} >

                        {selectedImage && (
                            <div className='bg-black/90 absolute w-full pb-10 p-5 left-0 bottom-16 z-[-1] flex justify-center items-center rounded-lg rounded-b-none '>
                                {!isSendingImage && (
                                    <div
                                        onClick={() => setSelectedImage(null)}
                                        diable={true}
                                        className='top-0 right-0 font-bold absolute p-8 text-2xl hover:bg-gray-500/40  cursor-pointer rounded-lg w-10 h-10 flex justify-center items-center'>
                                        X</div>
                                )}
                                <ImageUploader
                                    type="message-image"
                                    profile={preview}
                                    isUploading={isSendingImage}
                                    setIsUploading={setIsSendingImage}
                                    setSelectedImage={setSelectedImage}
                                    selectedImage={selectedImage}
                                    setUrlFirebase={setUrlFirebase}
                                    roomId={selectedRoom._id}
                                    setIsSendingImageSuccess={setIsSendingImageSuccess}

                                />

                            </div>
                        )}

                        {/* input */}
                        <div className='flex-1 flex flex-row'>
                            <label className={`hover:text-blue-500 cursor-pointer flex  items-center bg-${mainColor} h-full px-4 rounded-[20px] rounded-r-none`} htmlFor="image">
                                <HiPaperClip size={24} />
                                <input
                                    id="image"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept=".png, .jpg, .jpeg, .webp, .gif"
                                />
                            </label>

                            <input
                                type="text"
                                placeholder="Enter Your Message"
                                className={`outline-none rounded-[20px] rounded-l-none relative text-lg bg-${mainColor} flex-1 py-6 px-5`}
                                value={message}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        sendUserContent(selectedRoom._id, message, "text");
                                    }
                                }}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>


                    </div>

                    <Microphone setMessage={setMessage} />

                </div>
            </section>)}

        </div>
    );
}


function MessageItem({ content, memberProfile, memberName, user, socket, roomId }) {
    if (!content) return;
    const thiaDate = new Date(content.createdAt).toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
    });
    const isSender = user._id == content.senderId._id

    const emojiList = ["1F602", "1F610", , "1F614", "1F618", "1F620", "1F62D"];
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
                            <span
                                key={e}
                                className='cursor-pointer hover:scale-130'
                                onClick={() => handleReactEmoji(e)}
                            >
                                {toEmoji(e)}</span>
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

export default ChatMessage;
