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

import { socket } from '../../listeners/socketClient';
import { useEffect } from 'react';

function ChatMessage({ selectedRoom, setSelectedRoom, isUploading, setIsUploading, onChangProfile, setOnChangProfile, currentUser, users }) {
    if (!selectedRoom) return;
    const { user } = useAuth();

    const friendProfile = useMemo(() => {
        if (selectedRoom.isPrivate && selectedRoom.member && user) {

            const friend = selectedRoom.member.find((u) => u._id !== user._id);
            return friend ? friend.profile : null;
        }
        return null; // ถ้าไม่ใช่ Private room หรือหาไม่เจอ
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
            console.log('        ')
            console.log('receive msg = ', msg)
            queryClient.setQueryData(['contents', selectedRoom._id], (oldContents) => {
                if (!oldContents) return [msg];

                const isExisting = oldContents.some(content => content._id === msg._id);
                if (isExisting) return oldContents;
                return [...oldContents, msg];
            });
        };
        socket.on('receive-message', handleRecieveMessage);

        //    Cleanup Function (สำคัญมาก!)
        //    จะทำงานเมื่อ component unmount หรือ selectedRoom._id เปลี่ยน
        return () => {
            socket.off('receive-message', handleRecieveMessage);
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
        if (type == 'text') {
            const messageData = { roomId: roomId, content: content, type: type, senderId: user._id, createdAt: new Date() }
            socket.emit("send-message", messageData);
        }
        else if (type == 'image') {

            sendContent(roomId, content, type)
        }
        else {
            alert('Unknown message')
        }
        setMessage("")
    }

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
    }, [contents]);

    if (!contents) return;
    console.log(selectedRoom)


    return (
        <div className="bg-[#313131] flex flex-col h-auto grow my-8 mr-8 rounded-lg shadow-2xl relative">
            {isUploading && (<div className="bg-black/40 backdrop-blur-[1px] absolute inset-0"></div>)}
            {!isMember && (<div className="bg-[#313131]  absolute inset-0 flex flex-col justify-center items-center rounded-lg gap-5">
                <div>Do you want to join  <span className='font-bold text-xl text-[#ff9a00]'>"{selectedRoom.name}"</span> room</div>
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

            <header className="flex items-center justify-between p-4 bg-[#FF9A00] m-4 rounded-lg">
                <div className="flex items-center">
                    <img
                        src={selectedRoom.isPrivate ? friendProfile : selectedRoom.profile}
                        className={`w-15 h-15 rounded-full mr-3  object-cover bg-white`}
                        onClick={handleChangeProfile}
                    />
                    <div>
                        <h2 className="font-semibold text-white">{selectedRoom.name}</h2>
                        <p className="text-sm text-white">Online</p>
                    </div>
                </div>

                {/* <div className="flex space-x-4 text-gray-600">
                    <button><HiPhone size={24} /></button>
                    <button><HiVideoCamera size={24} /></button>
                    <button><HiEllipsisHorizontal size={24} /></button>
                </div> */}
            </header>

            <main className="flex-1 p-6 space-y-4 overflow-y-auto bg-[#313131]" ref={messagesEndRef}>
                {contents.map(content => {
                    return (
                        <MessageItem
                            key={content._id}
                            content={content}
                            memberProfile={content.senderId.profile}
                            memberName={content.senderId.name}
                        />
                    );
                })}
            </main>

            <section className="p-4 bg-[#313131] rounded-lg text-black">
                <div className="flex items-center bg-gray-100 rounded-lg p-2">
                    <button className="p-2 text-gray-600 hover:text-blue-500">
                        <HiPaperClip size={24} />
                    </button>
                    <input
                        type="text"
                        placeholder="Enter Your Message"
                        className="flex-1 bg-transparent px-4 py-2 outline-none"
                        value={message}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                sendUserContent(selectedRoom._id, message, "text");
                            }
                        }}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button className="p-2 text-gray-600 hover:text-blue-500 cursor-pointer">
                        <HiMicrophone size={24} />
                    </button>
                </div>
            </section>

        </div>
    );
}


function MessageItem({ content, memberProfile, memberName }) {
    if (!content) return;
    const thiaDate = new Date(content.createdAt).toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
    });


    return (
        <div className={`flex flex-row gap-3`}>

            <img src={memberProfile} alt="sender-profile" className='w-13 h-13 rounded-full object-cover bg-white' />

            <div className="flex max-w-lg flex-col">
                <div className='flex flex-row gap-2 items-end'>
                    <span className='font-bold'> {memberName}</span>
                    <span className='text-xs pb-0.5'>{thiaDate}</span>
                </div>

                <div className={`flex self-start px-4 py-3 rounded-xl bg-white text-black shadow-md rounded-tl-none`}>
                    <span>{content.content}</span>
                </div>


            </div>


        </div>
    );
}


export default ChatMessage;

