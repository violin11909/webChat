import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { socket } from '../../listeners/socketClient';
import { joinRoom } from '../../service/roomService';
// Components
import EditProfile from './subs/EditProfile';
import { ChatHeader } from './subs/ChatHeader';
import { MemberList } from './subs/MemberList';
import { MessageList } from './subs/MessageList';
import { ChatInput } from './subs/ChatInput';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingState } from '../../components/common/LoadingState';
// Hooks
import { useChatMessages } from '../../hooks/useChatMessages';
import { useChatMembers } from '../../hooks/useChatMembers';
import { useMessageScroll } from '../../hooks/useMessageScroll';
import { useFileUpload } from '../../hooks/useFileUpload';
import { NotMember } from './subs/NotMember';

function ChatMessage({ 
    selectedRoom, 
    setSelectedRoom, 
    isUploading, 
    setIsUploading, 
    onChangProfile, 
    setOnChangProfile, 
    isMemberListOpen, 
    setIsMemberListOpen 
}) {
    if (!selectedRoom) {
        return <EmptyState message="Select a room to start chatting." />;
    }

    const { user } = useAuth();
    const queryClient = useQueryClient();

    // States
    const [message, setMessage] = useState("");
    const [isSendingImage, setIsSendingImage] = useState(false);
    const [urlFirebase, setUrlFirebase] = useState("");
    const [isSendingImageSuccess, setIsSendingImageSuccess] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Hooks
    const { 
        contents, 
        isLoading, 
        isError, 
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage 
    } = useChatMessages(selectedRoom._id);

    const { isMember, friendData } = useChatMembers(
        selectedRoom, 
        setSelectedRoom, 
        user
    );

    const messagesEndRef = useMessageScroll(
        contents, 
        isLoading, 
        selectedRoom._id
    );

    const {
        selectedImage,
        setSelectedImage,
        preview,
        handleFileChange
    } = useFileUpload(2); 

    const filteredMembers = selectedRoom.member?.filter((m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const handleChangeProfile = () => {
        if (!selectedRoom.isPrivate) {
            setOnChangProfile(true);
        }
    };

    const sendUserContent = (roomId, content, type) => {
        const messageData = {
            roomId,
            content,
            type,
            senderId: user._id,
            createdAt: new Date()
        };

        if (type === 'text' || type === 'image') {
            socket.emit("send-message", messageData);
            setMessage("");
        } else {
            alert('Unknown message type');
        }
    };

    const handleJoinRoom = async () => {
        const res = await joinRoom(selectedRoom._id, user._id);
        if (res) {
            await queryClient.invalidateQueries({ queryKey: ['rooms'] });
            setSelectedRoom(res);
            
            socket.emit("member-joined", {
                roomId: res._id,
                newMember: {
                    _id: user._id,
                    name: user.name,
                    profile: user.profile,
                    email: user.email
                }
            });
            
            socket.emit("join-room", res._id);
        }
    };

    useEffect(() => {
        if (isSendingImageSuccess) {
            setIsSendingImageSuccess(false);
            sendUserContent(selectedRoom._id, urlFirebase, "image");
        }
    }, [isSendingImageSuccess]);

    if (isLoading) {
        return <LoadingState message="Loading messages..." />;
    }

    if (isError) {
        return <ErrorState message="Error loading messages." />;
    }

    // Render
    return (
        <div className="bg-[#313131] flex flex-col flex-1 rounded-[20px] shadow-2xl relative">
            {isUploading && (
                <div className="bg-black/40 backdrop-blur-[1px] absolute inset-0 z-50" />
            )}

            {onChangProfile && (
                <EditProfile
                    setOnChangProfile={setOnChangProfile}
                    type="room-profile"
                    profile={selectedRoom.profile}
                    roomId={selectedRoom._id}
                    setSelectedRoom={setSelectedRoom}
                    isUploading={isUploading}
                    setIsUploading={setIsUploading}
                />
            )}

            <ChatHeader
                selectedRoom={selectedRoom}
                friendData={friendData}
                handleChangeProfile={handleChangeProfile}
                isMemberListOpen={isMemberListOpen}
                setIsMemberListOpen={setIsMemberListOpen}
            />

            {isMemberListOpen && (
                <MemberList
                    members={filteredMembers}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    setIsMemberListOpen={setIsMemberListOpen}
                />
            )}

            {isMember ? (
                <>
                    <MessageList
                        contents={contents}
                        messagesEndRef={messagesEndRef}
                        hasNextPage={hasNextPage}
                        fetchNextPage={fetchNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        user={user}
                        roomId={selectedRoom._id}
                        socket={socket}
                    />
                    <ChatInput
                        message={message}
                        setMessage={setMessage}
                        selectedImage={selectedImage}
                        setSelectedImage={setSelectedImage}
                        preview={preview}
                        handleFileChange={handleFileChange}
                        isSendingImage={isSendingImage}
                        setIsSendingImage={setIsSendingImage}
                        setUrlFirebase={setUrlFirebase}
                        setIsSendingImageSuccess={setIsSendingImageSuccess}
                        sendUserContent={sendUserContent}
                        roomId={selectedRoom._id}
                    />
                </>
            ) : (
                <NotMember handleJoinRoom={handleJoinRoom}/>
            )}
        </div>
    );
}

export default ChatMessage;