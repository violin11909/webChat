
import Sidebar from './components/layout/Sidebar';
import ChatMessage from './pages/chat/ChatMessage';
import ChatList from './pages/chat/ChatList';


function App() {
  return (

    <div className="h-screen w-screen overflow-hidden bg-blue-100 flex flex-row">
      <Sidebar />
      <ChatList />
      <ChatMessage />
    </div>
  );
}



export default App;
