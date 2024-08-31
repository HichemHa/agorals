const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { generateToken } = require('./agoraService');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', (data) => {
    socket.join(data.roomId);
    const uid = Math.floor(Math.random() * 1000); // UID unique pour chaque utilisateur
    const role = data.role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    const token = generateToken(data.roomId, uid, role);
    socket.emit('roomJoined', { token });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
