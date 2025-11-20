export const ChatMessage = ({ msg, selectedUser }: any) => (
    <div className={`flex items-end ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
        {msg.sender !== 'me' && (
            <img src={selectedUser.avatar} alt={selectedUser.name} className="h-8 w-8 rounded-full object-cover mr-2" />
        )}
        <div className={`max-w-[70%] rounded-2xl px-4 py-2 break-words ${msg.sender === 'me' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100'}`}>
            <p className="text-sm leading-relaxed">{msg.text}</p>
            <span className={`text-xs mt-1 block ${msg.sender === 'me' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>{msg.time}</span>
        </div>
        {msg.sender === 'me' && <img src="/me-avatar.png" alt="Me" className="h-8 w-8 rounded-full object-cover ml-2" />}
    </div>
);
