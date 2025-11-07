const groups = [
    { name: "Group A", msg: "มีเเต่งาน", img: "https://placeimg.com/100/100/people/1", active: true },
    { name: "Group B", msg: "เเล้วก็งาน", img: "https://placeimg.com/100/100/arch/1", active: false },
    { name: "Group C", msg: "เหนื่อยชหเทอมนี้", img: "https://placeimg.com/100/100/nature/1", active: false },
];

const personal = [
    { name: "Bas", msg: "Zzzz", img: "https://placeimg.com/100/100/people/2", active: false },
   
];


function ChatList() {
    return (
        <div className="min-w-100 bg-blue-50 p-6 overflow-y-auto">
            <section>
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Groups</h2>
                <div className="space-y-4">
                    {groups.map(group => (
                        <ChatItem key={group.name} {...group} />
                    ))}
                </div>
            </section>

         
            <section className="mt-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Personal</h2>
                <div className="space-y-4">
                    {personal.map(person => (
                        <ChatItem key={person.name} {...person} />
                    ))}
                </div>
            </section>
        </div>
    );
}

function ChatItem({ name, msg, img, active }) {
    return (
        <div className={`flex items-center p-3 rounded-xl cursor-pointer ${active ? 'bg-blue-200' : 'bg-white hover:bg-gray-100'} shadow-sm`}>
            <img src={img} alt={name} className="w-12 h-12 rounded-full mr-4" />
            <div>
                <h3 className="font-semibold text-blue-900">{name}</h3>
                <p className="text-sm text-gray-600">{msg}</p>
            </div>
        </div>
    );
}
export default ChatList;