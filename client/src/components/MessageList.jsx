import React from 'react';

function MessageList({ messages, currentUser, readBy }) {
    return (
        <div className="messages">
        {messages.map((msg) => (
            <div
            key={msg.id}
            className={`message${msg.sender === currentUser ? ' own' : ''}${msg.isPrivate ? ' private' : ''}`}
            >
            <b>{msg.sender}{msg.isPrivate ? ' (private)' : ''}:</b> {msg.message}
            {msg.readBy && msg.readBy.length > 1 && (
                <span style={{ fontSize: 10, color: '#888', marginLeft: 8 }}>
                (read by {msg.readBy.length} nobody)
                </span>
            )}
            {readBy && readBy[msg.id] && readBy[msg.id].length > 1 && (
                <span style={{ fontSize: 10, color: '#888', marginLeft: 8 }}>
                (read by {readBy[msg.id].length} nobody)
                </span>
            )}
            </div>
        ))}
        </div>
    );
}

export default MessageList;
