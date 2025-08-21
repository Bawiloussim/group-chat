import React from 'react';

function NotificationBar({ notifications }) {
    return (
        <div className="notification-bar">
        {notifications.slice(-3).map((notif, idx) => (
            <div key={idx} className={`notif notif-${notif.type}`}>
            {notif.type === 'new_message' && (
                <span>New message in <b>{notif.message.room || 'general'}</b></span>
            )}
            {notif.type === 'private_message' && (
                <span>New private message in <b>{notif.message.sender}</b></span>
            )}
            {notif.type === 'user_joined_room' && (
                <span><b>{notif.user.username}</b> joined the room <b>{notif.room}</b></span>
            )}
            {notif.type === 'user_left_room' && (
                <span><b>{notif.user.username}</b> leave the room <b>{notif.room}</b></span>
            )}
            {notif.type === 'user_left' && (
                <span><b>{notif.user.username}</b> leave the chat</span>
            )}
            </div>
        ))}
        </div>
    );
}

export default NotificationBar;
