
import Sidebar from './component/Sidebar';
import ChatMessage from './component/ChatMessage';
import ChatList from './component/ChatList';

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
