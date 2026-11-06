const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

const rooms = new Map();

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';

  for (let i = 0; i < 6; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
}

function sanitizePlayers(room) {
  return room.players.map((player) => ({
    id: player.id,
    name: player.name,
    score: player.score,
    grade: player.grade,
    subject: player.subject,
    mode: player.mode
  }));
}

function getRoom(code) {
  return rooms.get(String(code || '').toUpperCase());
}

app.use(express.static(path.join(__dirname)));

app.get('/health', (_req, res) => {
  res.json({ ok: true, message: 'Bright Future multiplayer server ready' });
});

io.on('connection', (socket) => {
  socket.on('room:create', ({ name, grade, subject, mode }) => {
    let roomCode = generateRoomCode();

    while (rooms.has(roomCode)) {
      roomCode = generateRoomCode();
    }

    const room = {
      code: roomCode,
      players: [{
        id: socket.id,
        name: name || 'Player 1',
        grade: grade || 'Class 1',
        subject: subject || 'math',
        mode: mode || 'easy',
        score: 0
      }],
      currentIndex: 0,
      gameStarted: false,
      answers: {}
    };

    rooms.set(roomCode, room);
    socket.join(roomCode);
    socket.data.roomCode = roomCode;

    socket.emit('room:created', {
      code: roomCode,
      playerId: socket.id,
      role: 'host'
    });

    socket.emit('room:state', {
      code: roomCode,
      players: sanitizePlayers(room)
    });
  });

  socket.on('room:join', ({ code, name, grade, subject, mode }) => {
    const roomCode = String(code || '').toUpperCase();
    const room = getRoom(roomCode);

    if (!room) {
      socket.emit('room:error', { message: 'Room not found. Please check the code.' });
      return;
    }

    if (room.players.length >= 2) {
      socket.emit('room:error', { message: 'This room is already full.' });
      return;
    }

    room.players.push({
      id: socket.id,
      name: name || 'Player 2',
      grade: grade || room.players[0].grade,
      subject: subject || room.players[0].subject,
      mode: mode || room.players[0].mode,
      score: 0
    });

    socket.join(roomCode);
    socket.data.roomCode = roomCode;

    io.to(roomCode).emit('room:state', {
      code: roomCode,
      players: sanitizePlayers(room)
    });

    if (room.players.length === 2) {
      io.to(roomCode).emit('room:ready', {
        code: roomCode,
        players: sanitizePlayers(room)
      });
    }
  });

  socket.on('game:start', ({ code }) => {
    const roomCode = String(code || '').toUpperCase();
    const room = getRoom(roomCode);

    if (!room) {
      socket.emit('room:error', { message: 'Room not found. Please check the code.' });
      return;
    }

    if (room.players.length < 2) {
      socket.emit('room:error', { message: 'Waiting for your friend to join the room.' });
      return;
    }

    room.currentIndex = 0;
    room.gameStarted = true;
    room.answers = {};
    room.players.forEach((player) => {
      player.score = 0;
    });

    io.to(roomCode).emit('game:start', {
      code: roomCode,
      currentIndex: 0,
      players: sanitizePlayers(room)
    });
  });

  socket.on('game:answer', ({ code, questionIndex, answerIndex, correctIndex }) => {
    const roomCode = String(code || '').toUpperCase();
    const room = getRoom(roomCode);

    if (!room || !room.gameStarted) {
      return;
    }

    const player = room.players.find((entry) => entry.id === socket.id);
    if (!player) {
      return;
    }

    room.answers[socket.id] = {
      questionIndex,
      answerIndex,
      correctIndex
    };

    const totalPlayers = room.players.length;
    const answeredPlayers = room.players.filter((entry) => room.answers[entry.id] && room.answers[entry.id].questionIndex === questionIndex);

    if (answeredPlayers.length < totalPlayers) {
      return;
    }

    room.players.forEach((entry) => {
      const typedAnswer = room.answers[entry.id];
      if (typedAnswer && Number(typedAnswer.answerIndex) === Number(typedAnswer.correctIndex)) {
        entry.score += 1;
      }
    });

    room.answers = {};
    const finished = room.currentIndex + 1 >= 10;
    room.currentIndex += 1;

    io.to(roomCode).emit('game:advance', {
      code: roomCode,
      currentIndex: room.currentIndex,
      finished,
      players: sanitizePlayers(room)
    });
  });

  socket.on('disconnect', () => {
    const roomCode = socket.data.roomCode;

    if (!roomCode) {
      return;
    }

    const room = getRoom(roomCode);

    if (!room) {
      return;
    }

    room.players = room.players.filter((player) => player.id !== socket.id);

    if (room.players.length === 0) {
      rooms.delete(roomCode);
      return;
    }

    io.to(roomCode).emit('room:state', {
      code: roomCode,
      players: sanitizePlayers(room)
    });

    io.to(roomCode).emit('room:error', {
      message: 'A player disconnected. Waiting for a new friend to join.'
    });
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Bright Future multiplayer server is running at http://localhost:${port}`);
});
