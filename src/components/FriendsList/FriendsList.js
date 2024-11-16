import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';

const FriendsList = ({ startChat }) => {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axiosInstance.get('/friends');
        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, []);

const handleStartChat = (friend) => {
    if (typeof startChat === 'function') {
      startChat(friend);
      navigate('/chat');
    } else {
      console.error('startChat is not a function');
    }
  };

  return (
    <div>
      <h2>Friends List</h2>
      {friends.length === 0 ? (
        <p>No friends found</p>
      ) : (
        <ul>
          {friends.map(friend => (
            <li key={friend.username} className="user-list-item">
              {friend.name}
              <button onClick={() => handleStartChat(friend.username)}>Start Chat</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendsList;