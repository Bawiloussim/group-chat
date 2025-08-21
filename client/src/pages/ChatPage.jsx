import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import MessageList from '../components/MessageList';
import UserList from '../components/UserList';
import usePrivateMessage from '../hooks/usePrivateMessage';
import RoomSelector from '../components/RoomSelector';
import NotificationBar from '../components/NotificationBar';

function ChatPage() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [typingUsers, setTypingUsers] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [privateTo, setPrivateTo] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [rooms, setRooms] = useState(['general']);
    const [currentRoom, setCurrentRoom] = useState('general');
    const [readBy, setReadBy] = useState({});
    const socket = useSocket();
    const username = localStorage.getItem('username');
    const navigate = useNavigate();
    const typingTimeout = useRef(null);
    const sendPrivateMessage = usePrivateMessage();

    useEffect(() => {
        if (!username) navigate('/');
        if (socket && username) {
        socket.emit('user_join', username);
        socket.emit('join_room', currentRoom);
        socket.on('receive_message', (msg) => {
            setMessages((prev) => [...prev, msg]);
            if (!msg.isPrivate && msg.room && !rooms.includes(msg.room)) {
            setRooms((r) => [...r, msg.room]);
            }
        });
        socket.on('private_message', (msg) => setMessages((prev) => [...prev, msg]));
        socket.on('user_list', setUsers);
        socket.on('typing_users', setTypingUsers);
        socket.on('notification', (notif) => setNotifications((prev) => [...prev, notif]));
        socket.on('room_history', (roomMsgs) => setMessages(roomMsgs));
        socket.on('message_read', ({ messageId, userId }) => {
            setReadBy((prev) => ({ ...prev, [messageId]: [...(prev[messageId] || []), userId] }));
        });
        return () => {
            socket.off('receive_message');
            socket.off('private_message');
            socket.off('user_list');
            socket.off('typing_users');
            socket.off('notification');
            socket.off('room_history');
            socket.off('message_read');
        };
        }
    }, [socket, username, navigate, currentRoom, rooms]);

    const handleSend = (e) => {
        e.preventDefault();
        if (message.trim()) {
        if (privateTo) {
            sendPrivateMessage(privateTo.id, message);
        } else {
            socket.emit('send_message', { message, room: currentRoom });
        }
        setMessage('');
        setIsTyping(false);
        socket.emit('typing', false);
        setPrivateTo(null);
        }
    };

    const handleTyping = (e) => {
        setMessage(e.target.value);
        if (!isTyping) {
        setIsTyping(true);
        socket.emit('typing', true);
        }
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => {
        setIsTyping(false);
        socket.emit('typing', false);
        }, 1000);
    };

    const handlePrivateMessage = (user) => {
        setPrivateTo(user);
    };

    const handleJoinRoom = (room) => {
        if (room !== currentRoom) {
        socket.emit('leave_room', currentRoom);
        setCurrentRoom(room);
        socket.emit('join_room', room);
        }
    };

    // Marquer les messages comme lus
    useEffect(() => {
        if (socket && messages.length > 0) {
        messages.forEach((msg) => {
            if (!msg.isPrivate && msg.room === currentRoom && !(msg.readBy || []).includes(socket.id)) {
            socket.emit('read_message', msg.id);
            }
        });
        }
    }, [messages, socket, currentRoom]);

    return (
        <div className="chat-page">
        <NotificationBar notifications={notifications} />
        <RoomSelector rooms={rooms} currentRoom={currentRoom} onJoin={handleJoinRoom} />
        <UserList users={users} onPrivateMessage={handlePrivateMessage} currentUserId={socket?.id} />
        <div className="chat-box">
            <MessageList messages={messages.filter(m => !m.isPrivate && (m.room || 'general') === currentRoom)} currentUser={username} readBy={readBy} />
            <div className="typing-indicator">
            {typingUsers.length > 0 && (
                <span>{typingUsers.join(', ')} typing...</span>
            )}
            </div>
            {privateTo && (
            <div style={{ color: 'red', marginBottom: 8 }}>
                Private message to <b>{privateTo.username}</b> <button onClick={() => setPrivateTo(null)}>Cancel</button>
            </div>
            )}
            <form onSubmit={handleSend} className="message-form">
            <input
                type="text"
                value={message}
                onChange={handleTyping}
                placeholder={privateTo ? `Private message to ${privateTo.username}` : `Your message in ${currentRoom}...`}
                autoFocus
            />
            <button type="submit">Send</button>
            </form>
        </div>
        </div>
    );
}

export default ChatPage;
