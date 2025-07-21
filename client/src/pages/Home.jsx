import { useEffect, useState } from "react";
import { getRooms, createRoom, getMessages, socket } from "../services/backend";
import ChatRoom from "../components/ChatRoom";

export default function Home({ user }) {
    const [rooms, setRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetchRooms();
        socket.connect();
        return () => socket.disconnect();
    }, []);

    const fetchRooms = async () => {
        try {
        const res = await getRooms();
        setRooms(res.data);
        } catch (error) {
        console.error("Failed to fetch rooms", error.message); 
        }
    };

    const handleJoinRoom = async (room) => {
        socket.emit("joinRoom", { username: user.username, roomId: room._id });
        setCurrentRoom(room);
        const res = await getMessages(room._id);
        setMessages(res.data);
    };

    return (
        <div className="flex h-screen">
        <aside className="w-1/4 bg-gray-500 text-white p-4">
            <h2 className="text-lg mb-2">Rooms</h2>
            <ul>
            {rooms.map((room) => (
                <li key={room._id} className="mb-2"> 
                <button
                    onClick={() => handleJoinRoom(room)}
                    className="w-full p-2 rounded hover:bg-gray-700" 
                >
                    {room.name}
                </button>
                </li>
            ))}
            </ul>
        </aside>

        <main className="flex-1 p-4">
            {currentRoom ? (
            <ChatRoom
                room={currentRoom}
                messages={messages}
                user={user}
                socket={socket}
            />
            ) : (
            <p>Select a room to join</p>
            )}
        </main>
        </div>
    );
}
