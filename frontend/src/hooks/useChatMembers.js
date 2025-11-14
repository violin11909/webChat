import { useMemo, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socket } from '../listeners/socketClient';

export function useChatMembers(selectedRoom, setSelectedRoom, user) {
    const queryClient = useQueryClient();

    const mapMemberProfile = useMemo(() => {
        if (!selectedRoom?.member) return {};
        return selectedRoom.member.reduce((acc, m) => {
            acc[m._id] = [m.profile, m.name];
            return acc;
        }, {});
    }, [selectedRoom]);

    const isMember = useMemo(() => {
        if (!selectedRoom || !mapMemberProfile || !user) return false;
        return !!mapMemberProfile[user._id];
    }, [selectedRoom, mapMemberProfile, user]);

    const friendData = useMemo(() => {
        if (selectedRoom?.isPrivate && selectedRoom?.member && user) {
            return selectedRoom.member.find((u) => u._id !== user._id) || null;
        }
        return null;
    }, [selectedRoom, user]);

    useEffect(() => {
        if (!selectedRoom?._id) return;

        const handleMemberJoined = (data) => {
            if (data.roomId === selectedRoom._id) {
                setSelectedRoom((prevRoom) => {
                    const isMemberExist = prevRoom.member?.some(
                        m => m._id === data.newMember._id
                    );
                    if (!isMemberExist) {
                        return {
                            ...prevRoom,
                            member: [...(prevRoom.member || []), data.newMember]
                        };
                    }
                    return prevRoom;
                });
            }

            queryClient.setQueryData(['rooms'], (oldRooms) => {
                if (!oldRooms) return oldRooms;
                return oldRooms.map(room => {
                    if (room._id === data.roomId) {
                        const isMemberExist = room.member?.some(
                            m => m._id === data.newMember._id
                        );
                        if (!isMemberExist) {
                            return {
                                ...room,
                                member: [...(room.member || []), data.newMember]
                            };
                        }
                    }
                    return room;
                });
            });
        };

        socket.on('member-joined', handleMemberJoined);
        return () => socket.off('member-joined', handleMemberJoined);
    }, [queryClient, selectedRoom?._id, setSelectedRoom]);

    return { mapMemberProfile, isMember, friendData };
}