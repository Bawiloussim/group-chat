import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';
import { SocketProvider } from './context/SocketContext';

function App() {
    return (
        <SocketProvider>
        <Router>
            <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/chat" element={<ChatPage />} />
            </Routes>
        </Router>
        </SocketProvider>
    );
}

export default App;
