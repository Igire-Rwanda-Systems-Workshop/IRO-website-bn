// src/socket/socketServer.js
import { Server as SocketIOServer } from 'socket.io';

const initSocketServer = (httpServer) => {
    const io = new SocketIOServer(httpServer);

    io.on('connection', (socket) => {
        console.log('New WebSocket connection');

        socket.on('disconnect', () => {
            console.log('WebSocket disconnected');
        });
    });

    return io;
};

export { initSocketServer };
