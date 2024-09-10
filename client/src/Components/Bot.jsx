import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const Bot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, type: "bot", text: "Hello! How can I assist you today?" },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
  
    if (inputValue.trim() === "") return;
  
    const userMessage = { id: messages.length + 1, type: "user", text: inputValue };
    setMessages([...messages, userMessage]);
    setInputValue("");
    setLoading(true);
  
    try {
      const response = await axios.post("https://server-rho-six-68.vercel.app/api/df_text_query", {
        text: inputValue,
        parameters: {},
      });
  
      const botMessage = {
        id: messages.length + 2,
        type: "bot",
        text: response.data.fulfillmentText || "I'm sorry, I didn't understand that.",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  
    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer rounded-full bg-blue-500 text-white p-4 shadow-lg hover:bg-blue-600"
      >
        <MessageCircleIcon className="h-6 w-6" />
      </motion.div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden w-80 h-96 flex flex-col mt-4"
        >
          <div className="bg-blue-500 text-white p-4">
            <h2 className="text-lg font-semibold">Chat with our AI assistant</h2>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} mb-4`}
              >
                {message.type === "bot" && (
                  <Avatar>
                    <AvatarImage />
                  </Avatar>
                )}
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    message.type === "user" ? "bg-blue-500 text-white" : "bg-gray-100"
                  }`}
                >
                  <p>{message.text}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex mb-4">
                <Avatar>
                  <AvatarImage />
                </Avatar>
                <div className="max-w-xs p-2 rounded-lg bg-gray-100">
                  <p className="italic text-gray-500">Bot is typing...</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-gray-100 flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 rounded-lg border border-gray-300"
            />
            <button
              type="submit"
              className="ml-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

const Avatar = ({ children }) => (
  <div className="flex-shrink-0 h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
    {children}
  </div>
);

const AvatarImage = () => <span>🤖</span>;

function MessageCircleIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

function SendIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

export default Bot;
