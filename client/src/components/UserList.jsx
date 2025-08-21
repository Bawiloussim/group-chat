import React from 'react';

function UserList({ users, onPrivateMessage, currentUserId }) {
    return (
        <div className="users-list">
        <h4>Users connected</h4>
        <ul>
            {users.map((u) => (
            <li key={u.id}>
                {u.username} {u.id === currentUserId && '(you)'}
                {u.id !== currentUserId && (
                <button onClick={() => onPrivateMessage(u)}>Private</button>
                )}
            </li>
            ))}
        </ul>
        </div>
    );
}

export default UserList;
