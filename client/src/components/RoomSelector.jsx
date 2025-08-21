import React, { useState } from 'react';

function RoomSelector({ rooms, currentRoom, onJoin }) {
    const [roomInput, setRoomInput] = useState('');
    return (
        <div className="room-selector">
        <h4>Rooms</h4>
        <ul>
            {rooms.map((room) => (
            <li key={room}>
                <button
                disabled={room === currentRoom}
                onClick={() => onJoin(room)}
                >
                {room} {room === currentRoom && '(current)'}
                </button>
            </li>
            ))}
        </ul>
        <form
            onSubmit={e => {
            e.preventDefault();
            if (roomInput.trim()) {
                onJoin(roomInput.trim());
                setRoomInput('');
            }
            }}
        >
            <input
            type="text"
            placeholder="New room"
            value={roomInput}
            onChange={e => setRoomInput(e.target.value)}
            />
            <button type="submit">Create/join</button>
        </form>
        </div>
    );
}

export default RoomSelector;
