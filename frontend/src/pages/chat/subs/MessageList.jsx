import { MessageItem } from '../items/MessageItem';

export function MessageList({ contents, messagesEndRef, hasNextPage, fetchNextPage, isFetchingNextPage, user, roomId, socket }) {
    return (
        <main className="p-6 space-y-4 overflow-y-auto h-full" ref={messagesEndRef}>
            {hasNextPage && (
                <div className="text-center">
                    <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 disabled:bg-gray-800"
                    >
                        {isFetchingNextPage ? 'Loading more...' : 'Load More'}
                    </button>
                </div>
            )}
            
            {contents.map(content => (
                <MessageItem
                    key={content._id}
                    content={content}
                    memberProfile={content.senderId.profile}
                    memberName={content.senderId.name}
                    user={user}
                    roomId={roomId}
                    socket={socket}
                />
            ))}
        </main>
    );
}