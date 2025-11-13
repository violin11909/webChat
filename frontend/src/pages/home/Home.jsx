
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center flex-1 bg-[#313131] text-white rounded-[20px] shadow-lg p-6">
      <h1 className="text-4xl font-bold mb-4">Welcome, {user?.name}!</h1>
      <p className="text-lg mb-8">Ready to connect with your friends?</p>
      <button
        onClick={() => navigate('/chat')}
        className="bg-[#FF9A00] hover:bg-orange-500 text-white font-bold py-3 px-6 rounded-lg text-xl"
      >
        Go to Chat
      </button>
    </div>
  );
}

export default Home;
