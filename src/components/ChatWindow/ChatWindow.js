import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../axiosInstance';
import './ChatWindow.css';

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const receiverName = localStorage.getItem('selectedFriend');
  const senderName = localStorage.getItem('loggedInUserName');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axiosInstance.get(`/messages/${receiverName}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    const intervalId = setInterval(fetchMessages, 1000); // Fetch messages every 30 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [receiverName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      const response = await axiosInstance.post('/send', {
        sender: senderName,
        receiver: receiverName,
        message: newMessage,
      });

      const newMessageObject = {
        chatId: "",
        sender: senderName,
        receiver: receiverName,
        message: newMessage,
      };

      setMessages([...messages, newMessageObject]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        <div className="chat-header">
          <h2>Chat with {receiverName.charAt(0).toUpperCase() + receiverName.slice(1)}</h2>
        </div>
        <div className="messages-list">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-item ${message.sender === senderName ? 'sent' : 'received'}`}
            >
              {message.message}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="send-message">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;