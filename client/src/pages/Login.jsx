import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/backend";

export default function Login({ setUser }) {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!username.trim()) return; 
        const res = await registerUser(username);
        setUser(res.data);
        navigate("/");
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="p-6 bg-white rounded shadow-md w-96">
            <h1 className="text-xl font-bold mb-4">Welcome</h1>
            <input
            className="w-full p-2 border rounded mb-4"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
            <button
            onClick={handleLogin} // Corrigé
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
            Enter
            </button>
        </div>
        </div>
    );
}
