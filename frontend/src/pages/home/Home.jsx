import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { socket } from '../../listeners/socketClient';

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user) return;

    socket.emit('get-online-users');

    const handleUpdateOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    socket.on('update-online-users', handleUpdateOnlineUsers);

    socket.on('online-users-list', handleUpdateOnlineUsers);

    return () => {
      socket.off('update-online-users', handleUpdateOnlineUsers);
      socket.off('online-users-list', handleUpdateOnlineUsers);
    };
  }, [user]);

  return (
    <div className="flex flex-col flex-1 bg-[#313131] text-white rounded-[20px] shadow-lg p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome, {user?.name}!</h1>
        <p className="text-lg">Ready to connect with your friends?</p>
      </div>

      <div className="flex-1 flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-4">
          Currently Online ({onlineUsers.length})
        </h2>

        <div className="w-full max-w-5xl flex flex-wrap justify-center gap-6 overflow-y-auto p-4 rounded-xl bg-[#222] scrollbar">
          {onlineUsers.length > 0 ? (
            onlineUsers.map((onlineUser) => (
              <div
                key={onlineUser._id}
                className="flex flex-col items-center w-28 bg-[#3a3a3a] p-3 rounded-xl shadow-md hover:scale-105 transition-transform duration-150"
              >
                <img
                  src={onlineUser.profile}
                  alt={onlineUser.name}
                  className="w-16 h-16 rounded-full object-cover bg-white mb-2"
                />
                <span className="text-sm text-center font-medium break-words">
                  {onlineUser.name}
                  {onlineUser._id === user._id && (
                    <span className="text-yellow-400"> (You)</span>
                  )}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No users are currently online.</p>
          )}
        </div>
      </div>

      <button
        onClick={() => navigate('/chat')}
        className="bg-[#FF9A00] hover:bg-orange-500 text-white font-bold py-3 px-8 rounded-lg text-xl mt-8 self-center shadow-md transition-all duration-150"
      >
        Go to Chat
      </button>
    </div>
  );
}

export default Home;
