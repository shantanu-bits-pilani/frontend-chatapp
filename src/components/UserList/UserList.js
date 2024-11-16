import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/users');
        const userProfile = await axiosInstance.get('/profile');
        setUsers(response.data);
        setUserData(userProfile.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const sendRequest = (username) => {
    axiosInstance.post(`/send-request/${username}`)
      .then(response => {
        console.log('Request sent:', response.data);
        setUserData(prevUserData => ({
          ...prevUserData,
          sent_requests: [...prevUserData.sent_requests, username]
        }));
      })
      .catch(error => {
        console.error('Error sending request:', error);
      });
  };

  const acceptRequest = (username) => {
    axiosInstance.post(`/accept-request/${username}`)
      .then(response => {
        console.log('Request accepted:', response.data);
        setUserData(prevUserData => ({
          ...prevUserData,
          received_requests: prevUserData.received_requests.filter(req => req !== username),
          friends: [...prevUserData.friends, username]
        }));
      })
      .catch(error => {
        console.error('Error accepting request:', error);
      });
  };

  const withdrawRequest = (username) => {
    axiosInstance.post(`/withdraw-request/${username}`)
      .then(response => {
        console.log('Request withdrawn:', response.data);
        setUserData(prevUserData => ({
          ...prevUserData,
          sent_requests: prevUserData.sent_requests.filter(req => req !== username)
        }));
      })
      .catch(error => {
        console.error('Error withdrawing request:', error);
      });
  };

  return (
    <div>
      <h2>List of Users</h2>
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <ul>
          {users.filter(user => !userData?.friends.includes(user.username)).map(user => (
            <li key={user.username} className="user-list-item">
              {user.name ? user.username : user.username}
              {userData && userData.sent_requests.includes(user.username) ? (
                <button onClick={() => withdrawRequest(user.username)}>Withdraw Request</button>
              ) : userData && userData.received_requests.includes(user.username) ? (
                <button onClick={() => acceptRequest(user.username)}>Accept Request</button>
              ) : (
                <button onClick={() => sendRequest(user.username)}>Send Request</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;