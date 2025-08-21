import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const url = isLogin ? 'http://localhost:3000/api/login' : 'http://localhost:3000/api/register';
        try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erreur');
        if (isLogin) {
            localStorage.setItem('username', data.user.username);
            navigate('/chat');
        } else {
            setIsLogin(true);
            setUsername('');
            setPassword('');
        }
        } catch (err) {
        setError(err.message);
        }
    };

    return (
        <div className="login-page">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
            <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            />
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            />
            <button type="submit">{isLogin ? 'Sign in' : 'Sign up'}</button>
        </form>
        <button onClick={() => setIsLogin(l => !l)} style={{ marginTop: 12 }}>
            {isLogin ? "Create an account" : 'Already registered? Login'}
        </button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        </div>
    );
}

export default AuthPage;
