import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
        localStorage.setItem('username', username);
        navigate('/chat');
        }
    };

    return (
        <div className="login-page">
        <h2>Continue chatting</h2>
        <form onSubmit={handleSubmit}>
            <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            />
            <button type="submit">Enter</button>
        </form>
        </div>
    );
}

export default LoginPage;
