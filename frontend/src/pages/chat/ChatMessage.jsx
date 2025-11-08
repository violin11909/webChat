import { HiPhone, HiVideoCamera, HiEllipsisHorizontal, HiPaperClip, HiMicrophone } from 'react-icons/hi2';

const messages = [
    { id: 2, sender: false, content: 'มึงว่างานมันเยอะไปปะเทอมนี้', time: '9:20 AM' },
    { id: 3, sender: true, content: 'เออ', time: '9:23 AM' },
    { id: 4, sender: false, content: 'เทอมหน้ากุเรียน algo อีก ชห', time: '9:25 AM' },
    { id: 5, sender: true, content: 'ชิวๆ', time: '9:27 AM' },
];


function MessageItem({ msg }) {
    if (msg.type === 'divider') {
        return <div className="text-center text-gray-500 text-sm my-4">{msg.content}</div>;
    }

    const isSender = msg.sender;

    return (
        <div className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
            <div className="flex items-end max-w-lg">
                
                <div className={`px-4 py-3 rounded-xl ${isSender ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-black shadow-md rounded-bl-none'}`}>
                    <p>{msg.content}</p>
                </div>
                
                <span className={`text-xs text-gray-400 mx-2 ${isSender ? 'order-first' : ''}`}>
                    {msg.time}
                </span>
            </div>
        </div>
    );
}

function ChatMessage() {
    return (
        
        <div className="bg-white flex flex-col h-screen flex-grow">
           
            <header className="flex items-center justify-between p-4 border-b bg-blue-50">
                <div className="flex items-center">
                    <img src="https://picsum.photos/100/100"  alt="Benny" className="w-10 h-10 rounded-full mr-3" />
                    <div>
                        <h2 className="font-semibold text-blue-900">Bas</h2>
                        <p className="text-sm text-green-600">Online</p>
                    </div>
                </div>
                <div className="flex space-x-4 text-gray-600">
                    <button><HiPhone size={24} /></button>
                    <button><HiVideoCamera size={24} /></button>
                    <button><HiEllipsisHorizontal size={24} /></button>
                </div>
            </header>

            
            <main className="flex-1 p-6 space-y-4 overflow-y-auto bg-gray-100">
                {messages.map(msg => (
                    <MessageItem key={msg.id} msg={msg} />
                ))}
            </main>

            <footer className="p-4 bg-white border-t">
                <div className="flex items-center bg-gray-100 rounded-lg p-2">
                    <button className="p-2 text-gray-600 hover:text-blue-500">
                        <HiPaperClip size={24} />
                    </button>
                    <input
                        type="text"
                        placeholder="Enter Your Message"
                        className="flex-1 bg-transparent px-4 py-2 outline-none"
                    />
                    <button className="p-2 text-gray-600 hover:text-blue-500">
                        <HiMicrophone size={24} />
                    </button>
                </div>
            </footer>
        </div>
    );
}

export default ChatMessage;

