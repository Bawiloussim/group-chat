import { useCallback } from 'react';
import { useSocket } from '../context/SocketContext';

export default function usePrivateMessage() {
    const socket = useSocket();

    return useCallback((to, message) => {
        if (socket) {
        socket.emit('private_message', { to, message });
        }
    }, [socket]);
}
